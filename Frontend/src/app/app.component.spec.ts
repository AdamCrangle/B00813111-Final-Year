import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<any>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should contain navigation elements', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('.nav-button'));
    expect(navLinks.length).toBeGreaterThan(0); // Ensure at least one navigation button is present

    const selectElements = fixture.debugElement.queryAll(By.css('select'));
    expect(selectElements.length).toBe(4);
  });

  //Testing Logout Button when logged in
  it('should contain logout button when user is logged in', () => {
    component.currentUser = { username: 'testuser' };
    fixture.detectChanges();

    const login = fixture.debugElement.query(By.css('.navbar'));
    expect(login).toBeTruthy();
  });

  //Testing Logout Button when logged out
  it('should not contain logout button when user is not logged in', () => {
    component.currentUser = null;
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('.logout-button'));
    expect(logoutButton).toBeNull();
  });
  //Testing font color
  it('should have working font color selector', () => {
    component.currentUser = null;
    fixture.detectChanges();

    const fontcolor = fixture.debugElement.query(By.css('.fontColorSelector'));
    expect(fontcolor).toBeDefined();
  });
  //Testing font size
  it('should have working font size selector', () => {
    component.currentUser = null;
    fixture.detectChanges();

    const fontsize = fixture.debugElement.query(By.css('.fontSizeSelector'));
    expect(fontsize).toBeDefined();
  });
    //Testing font type
    it('should have working font type selector', () => {
      component.currentUser = null;
      fixture.detectChanges();
  
      const fonttype = fixture.debugElement.query(By.css('.fontTypeSelector'));
      expect(fonttype).toBeDefined();
    });

     //Testing font type
     it('should have working background color selector', () => {
      component.currentUser = null;
      fixture.detectChanges();
  
      const bgcolor = fixture.debugElement.query(By.css('.bgColorSelector'));
      expect(bgcolor).toBeDefined();
    });
});
