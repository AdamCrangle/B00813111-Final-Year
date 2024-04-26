import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../service/accessibility.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selectedFontColor: string = '';
  selectedFontSize: number = 16;
  selectedFontFamily: string = ""
  selectedBgColor: string = "";
  
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private accessibilityService: AccessibilityService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });

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

  checkPasswords(group: FormGroup) {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return; // Form is not valid, don't submit
    }
    const formData = this.registerForm.value;
    this.http.post<any>('http://localhost:5000/api/register', formData).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // Redirect to login page after registration
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }
}
