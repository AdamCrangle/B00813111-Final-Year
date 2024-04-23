import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [HttpClientModule,CommonModule,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  books: any = [];
  errorMessage: string = '';
  searchType: string = 'Title';
  searchOptions = [
    { label: 'Title', value: 'Title' },
    { label: 'Genre', value: 'Genre' },
    { label: 'Author', value: 'Author' },
    { label: 'Language', value: 'Language' },
    { label: 'Country', value: 'Country' }
  ];

  constructor(private http: HttpClient) {}

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
    const username = this.getUsername();  // Function to get current user's username

    if (!username) {
      this.errorMessage = 'User must be logged in to rent a book.';
      return;
    }

    this.http.post<any>(`http://localhost:5000/api/rent_book`, { username, Title: bookTitle })
      .subscribe({
        next: (response) => {
          console.log('Book rented:', response.message);
        },
        error: (err) => {
          this.errorMessage = `Failed to rent book.`;
          console.error(err);
        }
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
}
