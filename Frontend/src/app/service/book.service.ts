import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../model/book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:5000/api';  // Your API URL

  constructor(private http: HttpClient) { }
  searchBooks(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}?title=${title}`);
  }
}
