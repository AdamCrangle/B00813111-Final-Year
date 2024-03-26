import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Or ReactiveFormsModule for reactive forms

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule] // Assuming template-driven forms are used
})
export class LoginComponent {}
