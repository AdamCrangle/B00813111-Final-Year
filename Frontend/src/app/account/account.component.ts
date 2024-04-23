import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';
import { Book } from '../models/book';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;  // Initialize with a null check
  bookDetails: Book[] = [];
  rentalHistoryDetails: Book[] = [];  // Array for returned book details
  errorMessage: string = '';
  private apiUrl = 'http://localhost:5000/api';  // Adjust with your Flask API URL
  
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateCurrentUser();
  }
  private getUsername(): string | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.username;  // Get the username
    }
    return null;
  }
  private updateCurrentUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        this.http.get<User>(`${this.apiUrl}/users/${parsedData.username}`).subscribe({
          next: (user) => {
            this.currentUser = user;

            if (this.currentUser.currentlyRented) {
              const rentedBookTitles = this.extractBookTitles(this.currentUser.currentlyRented);
              this.getBookDetails(rentedBookTitles);  // Fetch currently rented book details
            }

            if (this.currentUser.rentalHistory) {
              const rentalHistoryTitles = this.extractBookTitles(this.currentUser.rentalHistory);
              this.getRentalHistoryDetails(rentalHistoryTitles);  // Fetch rental history book details
            }

            this.cdr.detectChanges();
          },
          error: (err) => {
            this.errorMessage = 'Error fetching user data';
            console.error(err);
          }
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  private extractBookTitles(bookObjects: any[]): string[] {
    return bookObjects.map((book) => {
      if (typeof book === 'object' && book.Title) {
        return book.Title;  // Extract the book title as a string
      }
      return '';  // Default to an empty string if there's no valid title
    }).filter((title) => title.trim() !== '');  // Remove empty or invalid titles
  }

  private getBookDetails(bookTitles: string[]): void {
    if (bookTitles.length === 0) {
      this.bookDetails = [];
      return;
    }

    const bookObservables = bookTitles.map((title) =>
      this.http.get<Book[]>(`${this.apiUrl}/search_books?type=Title&keyword=${encodeURIComponent(title)}`)
    );

    forkJoin(bookObservables).subscribe({
      next: (bookData) => {
        this.bookDetails = bookData.map((data) => data[0]);  // Get the first book from each response
        this.cdr.detectChanges();  // Trigger change detection
      },
      error: (err) => {
        this.errorMessage = 'Error fetching book details';
        console.error(err);
      }
    });
  }

  private getRentalHistoryDetails(bookTitles: string[]): void {
    if (bookTitles.length === 0) {
      this.rentalHistoryDetails = [];
      return;
    }

    const bookObservables = bookTitles.map((title) =>
      this.http.get<Book[]>(`${this.apiUrl}/search_books?type=Title&keyword=${encodeURIComponent(title)}`)
    );

    forkJoin(bookObservables).subscribe({
      next: (bookData) => {
        this.rentalHistoryDetails = bookData.map((data) => data[0]);  // Get the first book from each response
        this.cdr.detectChanges();  // Manually trigger change detection
      },
      error: (err) => {
        this.errorMessage = 'Error fetching rental history book details';
        console.error(err);
      }
    });
  }

  public returnBook(bookTitle: string): void {
    const username = this.getUsername();  // Fetch the current user's username

    if (!username) {
      this.errorMessage = 'User must be logged in to return a book.';
      return;
    }

    this.http.post<any>(`${this.apiUrl}/return_book`, { username, Title: bookTitle })
      .subscribe({
        next: (response) => {
          console.log('Book returned:', response.message);
          // Update the currently rented books and rental history
          this.updateCurrentUser();
        },
        error: (err) => {
          this.errorMessage = 'Failed to return book.';
          console.error(err);
        }
      });
  }
}