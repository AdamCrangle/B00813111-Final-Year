//Importing libaries and components
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
  // Applying the default settings for accessibility throughout the website
  selectedFontColor: string = ''; 
  selectedFontSize: number = 12; 
  selectedBgColor: string = ''; 
  selectedFontFamily: string = ''; 



  constructor(private router: Router, private cdr: ChangeDetectorRef,private accessibilityService: AccessibilityService) {}

  //Updates the page with the users information when available
  ngOnInit(): void {
    this.updateCurrentUser();
        // Loading all of the accessibility options from previous pages
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

  //This method allows for the changing of font color through a call to the accessiblity service
  onFontColorChange(event: any) {
    const selectedColor = event.target.value;
    this.accessibilityService.setFontColor(selectedColor);
  }

  //This method allows for the changing of font size through a call to the accessiblity service
  onFontSizeChange(event: any) {
    const selectedSize = parseInt(event.target.value, 10);
    this.accessibilityService.setFontSize(selectedSize);
  }

  //This method allows for the changing of background color through a call to the accessiblity service
  onBgColorChange(event: any) {
    const selectedColor = event.target.value;
    this.accessibilityService.setBgColor(selectedColor);
  }
//This method allows for the changing of font type through a call to the accessiblity service
  onFontTypeChange(event: any) {
    const selectedFont = event.target.value;
    this.accessibilityService.setFontFamily(selectedFont);
  }

  //Check if current user has a login token
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string {
    return this.currentUser && this.currentUser.username ? this.currentUser.username : '';
  }

  //Allows for the current user to be logged out through the removal of their access token
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
