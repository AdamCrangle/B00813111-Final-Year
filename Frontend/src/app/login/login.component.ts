import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient,HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule,CommonModule]
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
      return; // Stops the submission if form is invalid
    }
    const formData = this.loginForm.value;
    this.http.post<any>('http://localhost:5000/api/login', formData).subscribe(
      response => {
        console.log(response.message);
        this.router.navigate(['/']);  // Navigates to home page on successful login
      },
      error => {
        console.error(error.error.message);
        this.errorMessage = error.error.message;  // Sets an error message from the server
      }
    );
  }

  onRegister(): void {
    this.router.navigate(['/register']);  // Navigation for user registration
  }
}