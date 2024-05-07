import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../service/accessibility.service';

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
  selectedFontColor: string = '';
  selectedFontSize: number = 16;
  selectedFontFamily: string = ""
  selectedBgColor: string = "";
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router,private accessibilityService: AccessibilityService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],  // Ensures username is required
      password: ['', Validators.required]  // Ensures password is required
    });
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

//This section of my code controls the login functionality
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    const formData = this.loginForm.value;
    this.http.post<any>('http://localhost:5000/api/login', formData).subscribe(
      response => {

        // A token is added to local storage that allows the user to navigate the site and improves overall security
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user data
        this.router.navigate(['/']);  // Navigate to the home page
      },
      //validation for incorrect credentials
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
