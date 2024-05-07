import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //Testing Login Form
  it('should have working login form', () => {
    fixture.detectChanges();
    const loginForm = fixture.debugElement.query(By.css('.login-form'));
    expect(loginForm).toBeDefined();
  });
  //Testing form group
  it('should have working form group', () => {
    fixture.detectChanges();
    const formGroup = fixture.debugElement.query(By.css('.form-group'));
    expect(FormGroup).toBeDefined();
  });

  //Testing form action
  it('should have working form action', () => {
    fixture.detectChanges();
    const formAction = fixture.debugElement.query(By.css('.form-action'));
    expect(formAction).toBeDefined();
  });

  
});