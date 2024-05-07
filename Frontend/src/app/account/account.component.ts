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
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  // intialising variables to be used on this component
  user: User | null = null;
  activeBooks: Book[] = [];
  rentalHistory: Book[] = [];
  error: string = '';
  private baseUrl = 'http://localhost:5000/api'; // Flask API endpoint
  
  constructor(
    private http: HttpClient, // HTTP client for making requests
    private cdr: ChangeDetectorRef // Change detector for manual refresh
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  // function to get the username from local storage
  private getStoredUsername(): string | null {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return null; // No stored user data
    }
    //Converts the json into an object
    const parsedData = JSON.parse(userData);
    return parsedData.username || null;
  }

  // Update user information
  private loadUser(): void {
    const username = this.getStoredUsername(); // Retrieve stored username
    if (!username) return; // No username means no user data to fetch

    const url = `${this.baseUrl}/users/${username}`;

    this.http.get<User>(url).subscribe({
      next: (userInfo) => {
        this.user = userInfo; // Update the current user info
        
        // Load book details
        const rentedTitles = this.extractTitles(this.user.currentlyRented || []);
        this.fetchBookDetails(rentedTitles); 

        const historyTitles = this.extractTitles(this.user.rentalHistory || []);
        this.fetchHistoryDetails(historyTitles);

        this.cdr.detectChanges(); // Refresh the view
      },
      error: (err) => {
        console.error('Error fetching user data', err);
        this.error = 'Error fetching user information.';
      },
    });
  }

  // Extract the title of the books the user has linked to their account
  private extractTitles(books: any[]): string[] {
    return books
      .map((book) => (book?.Title || '').trim())
      .filter((title) => title);
  }

  // Fetch details of currently rented books
  private fetchBookDetails(titles: string[]): void {
    if (titles.length === 0) {
      this.activeBooks = []; // No books rented
      return;
    }
    //get all book details based on their title
    const requests = titles.map((title) =>
      this.http.get<Book[]>(`${this.baseUrl}/search_books?type=Title&keyword=${encodeURIComponent(title)}`)
    );

    forkJoin(requests).subscribe({
      next: (bookData) => {
        this.activeBooks = bookData.map((data) => data[0]); // Get the first result from each response
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching book details', err);
        this.error = 'Error fetching book details.';
      },
    });
  }

  // Fetch details of returned books
  private fetchHistoryDetails(titles: string[]): void {
    if (titles.length === 0) {
      this.rentalHistory = []; // No rental history
      return;
    }

    const requests = titles.map((title) =>
      this.http.get<Book[]>(`${this.baseUrl}/search_books?type=Title&keyword=${encodeURIComponent(title)}`)
    );

    forkJoin(requests).subscribe({
      next: (bookData) => {
        this.rentalHistory = bookData.map((data) => data[0]); // Get the first result from each response
        this.cdr.detectChanges(); // Refresh view
      },
      error: (err) => {
        console.error('Error fetching rental history book details', err);
        this.error = 'Problem fetching rental history details.';
      },
    });
  }

  // Function to return a rented book
  public returnBook(title: string): void {
    const username = this.getStoredUsername(); // Get the current user's name

    if (!username) {
      this.error = 'You must be logged in to return a book.'; // No user logged in
      return;
    }

    const data = { username, Title: title };

    this.http.post<any>(`${this.baseUrl}/return_book`, data).subscribe({
      next: (response) => {
        console.log('Book returned:', response.message);
        this.loadUser(); // Refresh user data after returning a book
      },
      error: (err) => {
        console.error('Error returning book', err);
        this.error = 'Could not return the book.';
      },
    });
  }
}
