import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private fontColorSubject = new BehaviorSubject<string>('#000000');
  private fontSizeSubject = new BehaviorSubject<number>(12);
  private bgColorSubject = new BehaviorSubject<string>('#ffffff');
  private fontFamilySubject = new BehaviorSubject<string>('Arial, Helvetica, sans-serif');

  fontColor$ = this.fontColorSubject.asObservable();
  fontSize$ = this.fontSizeSubject.asObservable();
  bgColor$ = this.bgColorSubject.asObservable();
  fontFamily$ = this.fontFamilySubject.asObservable();

  constructor() { }

  setFontColor(color: string) {
    this.fontColorSubject.next(color);
  }

  setFontSize(size: number) {
    this.fontSizeSubject.next(size);
  }

  setBgColor(color: string) {
    this.bgColorSubject.next(color);
  }

  setFontFamily(font: string) {
    this.fontFamilySubject.next(font);
  }
}
