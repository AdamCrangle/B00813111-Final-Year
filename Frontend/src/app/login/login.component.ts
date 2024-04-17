import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],  // Ensures username is required
      password: ['', Validators.required]  // Ensures password is required
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    const formData = this.loginForm.value;
    this.http.post<any>('http://localhost:5000/api/login', formData).subscribe(
      response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user data
        this.router.navigate(['/']);  // Navigate to the home page
      },
      error => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error(error);
      }
    );
  }
  onRegister(): void {
    this.router.navigate(['/register']);  // Navigation for user registration
  }
}
