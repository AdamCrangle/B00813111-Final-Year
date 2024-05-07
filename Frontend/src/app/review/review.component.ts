import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Review } from '../models/review';
import { FormsModule } from '@angular/forms'
import { AccessibilityService } from '../service/accessibility.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [HttpClientModule,CommonModule,FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  newReview: Partial<Review> = {};
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFontColor: string = '';
  selectedFontSize: number = 16;
  selectedFontFamily: string = ""
  selectedBgColor: string = "";

  constructor(private http: HttpClient, private accessibilityService: AccessibilityService) {}

  ngOnInit(): void {
    //On page load all the reviews are collected
    this.fetchReviews();
    this.accessibilityService.fontColor$.subscribe(color => {
      this.selectedFontColor = color;
    });
    this.accessibilityService.bgColor$.subscribe(bgcolor => {
      this.selectedBgColor = bgcolor;
    });
    this.accessibilityService.fontSize$.subscribe(fontsize => {
      this.selectedFontSize = fontsize;
    });

    this.accessibilityService.fontFamily$.subscribe(fontFamily => {
      this.selectedFontFamily = fontFamily
    });
  }

  //The reviews are collected through a call to the flask api
  fetchReviews(): void {
    this.http.get<Review[]>('http://localhost:5000/api/reviews').subscribe(
      (data) => {
        this.reviews = data;
      },
      (error) => {
        console.log(this.reviews)
        this.errorMessage = 'Error fetching reviews';
      }
    );
  }
//This function allows for the adding of new reviews via a post request to the flask
  submitReview(): void {
    this.http.post('http://localhost:5000/api/reviews', this.newReview).subscribe(
      () => {
        this.successMessage = 'Review submitted successfully';
        this.errorMessage = null;
        this.newReview = {};  // Clear the form after submission
        //The form is then reloaded to ensure that new reviews are displayed
        this.fetchReviews();
      },
      (error) => {
        this.successMessage = null;
        this.errorMessage = 'Error submitting review';
      }
    );
  }

  // Convert rating into an array of stars
  getStars(rating: number): string[] {
    return Array(rating).fill('★');
  }
}
