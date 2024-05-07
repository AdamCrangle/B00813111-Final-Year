import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Testing account container
  it('should have working form group', () => {
    fixture.detectChanges();
    const formgroup = fixture.debugElement.query(By.css('.account-container'));
    expect(formgroup).toBeDefined();
  });

  //Testing user info container
  it('should have working user info', () => {
    fixture.detectChanges();
    const info = fixture.debugElement.query(By.css('.user-info'));
    expect(info).toBeDefined();
  });

  //Testing books container
  it('should have working books container', () => {
    fixture.detectChanges();
    const bookcontainer = fixture.debugElement.query(By.css('.books-container'));
    expect(bookcontainer).toBeDefined();
  });

  

});
