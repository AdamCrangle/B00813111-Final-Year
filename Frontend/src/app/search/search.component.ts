import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessibilityService } from '../service/accessibility.service';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [HttpClientModule,CommonModule,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  books: any = [];
  errorMessage: string = '';
  successMessage: string = '';
  searchType: string = 'Title';
  searchOptions = [
    { label: 'Title', value: 'Title' },
    { label: 'Genre', value: 'Genre' },
    { label: 'Author', value: 'Author' },
    { label: 'Language', value: 'Language' },
    { label: 'Country', value: 'Country' }
  ];
  selectedFontColor: string = '';
  selectedFontSize: number = 16;
  selectedFontFamily: string = ""
  selectedBgColor: string = "";

  ngOnInit() 
  {
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

  constructor(private http: HttpClient,private accessibilityService: AccessibilityService) {}

  searchBooks(keyword: string): void {
    if (!keyword.trim()) {
      this.books = [];
      this.errorMessage = `Please enter a ${this.searchType} to search.`;
      return;
    }
    this.http.get<any[]>(`http://localhost:5000/api/search_books?type=${this.searchType}&keyword=${encodeURIComponent(keyword)}`)
      .subscribe({
        next: (data) => {
          this.books = data;
          if (this.books.length === 0) {
            this.errorMessage = `No books found matching the given ${this.searchType}`;
          } else {
            this.errorMessage = '';
          }
        },
        error: (err) => {
          this.errorMessage = `Error occurred while fetching data for ${this.searchType}`;
          console.error(err);
        }
      });
  }
  rentBook(bookTitle: string): void {
    const username = this.getUsername(); // Function to get current user's username

    if (!username) {
      this.errorMessage = 'User must be logged in to rent a book.';
      return;
    }

    this.http
      .post<any>(`http://localhost:5000/api/rent_book`, { username, Title: bookTitle })
      .subscribe({
        next: (response) => {
          this.successMessage = `The book "${bookTitle}" has been rented.`; // Set the success message
          console.log('Book rented:', response.message);
        },
        error: (err) => {
          this.errorMessage = `Failed to rent the book.`;
          console.error(err);
        },
      });
  }
  getUsername(): string | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.username;  // Extract username from user data
    }
    return null;
  }
  readBookDescription(book: any) {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();

    // Generating text to be read to user
    const description = `${book.Title} by ${book.Author}. Published in ${book.Year}, ${book.Country}. ${book.Genre} genre, ${book.Language}, ${book.Pages} pages. ${book.Description}`;

    // Set the text to be read
    utterance.text = description;
    speechSynthesis.speak(utterance);
  }
}
