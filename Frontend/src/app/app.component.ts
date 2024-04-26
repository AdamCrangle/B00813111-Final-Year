import { CommonModule } from '@angular/common';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AccessibilityService } from './service/accessibility.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule]
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  currentUser: any;
  selectedFontColor: string = ''; 
  selectedFontSize: number = 12; 
  selectedBgColor: string = ''; 
  selectedFontFamily: string = ''; 



  constructor(private router: Router, private cdr: ChangeDetectorRef,private accessibilityService: AccessibilityService) {}

  ngOnInit(): void {
    this.updateCurrentUser();
  }

  onFontColorChange(event: any) {
    const selectedColor = event.target.value;
    this.accessibilityService.setFontColor(selectedColor);
  }

  onFontSizeChange(event: any) {
    const selectedSize = parseInt(event.target.value, 10);
    this.accessibilityService.setFontSize(selectedSize);
  }

  onBgColorChange(event: any) {
    const selectedColor = event.target.value;
    this.accessibilityService.setBgColor(selectedColor);
  }

  onFontTypeChange(event: any) {
    const selectedFont = event.target.value;
    this.accessibilityService.setFontFamily(selectedFont);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string {
    return this.currentUser && this.currentUser.username ? this.currentUser.username : '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  private updateCurrentUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        console.log('Current User:', this.currentUser);
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }
}
