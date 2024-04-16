import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BookService } from '../service/book.service';
import { Book } from '../model/book';
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
  books: Book[] = [];
  title: string = '';

  constructor(private bookService: BookService) { }

  searchBooks(): void {
    this.bookService.searchBooks(this.title).subscribe(books => {
      this.books = books;
    });
  }
}
