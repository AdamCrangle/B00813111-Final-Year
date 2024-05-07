import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Testing heading container
  it('should have working header container', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.header'));
    expect(header).toBeDefined();
  });

  //Testing features container
  it('should have working features container', () => {
    fixture.detectChanges();
    const features = fixture.debugElement.query(By.css('.features'));
    expect(features).toBeDefined();
  });

  //Testing features-items container
  it('should have working features-items container', () => {
    fixture.detectChanges();
    const features = fixture.debugElement.query(By.css('.features-items'));
    expect(features).toBeDefined();
  });

    //Testing features-boxes container
    it('should have working features-boxes container', () => {
      fixture.detectChanges();
      const features = fixture.debugElement.query(By.css('.features-boxes'));
      expect(features).toBeDefined();
    });

});
