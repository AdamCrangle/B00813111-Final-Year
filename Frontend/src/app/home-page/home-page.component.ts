import { Component,OnInit } from '@angular/core';
import { AccessibilityService } from '../service/accessibility.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit
{

  selectedFontColor: string = '';
  selectedFontSize: number = 16;
  selectedFontFamily: string = ""
  selectedBgColor: string = "";

  constructor(private accessibilityService: AccessibilityService){}

  ngOnInit() 
  {

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

}
