import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
// Import other components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Define other routes here
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    // Declare other components here
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // Setup routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
