// Importing my Components to setup Routes
import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { AccountComponent } from './account/account.component';
import { ReviewComponent } from './review/review.component';


//Creating routes to each component
export const routes: Routes = 
[  
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'search', component: SearchComponent },
    { path: 'account', component: AccountComponent },
    { path: 'review', component: ReviewComponent },
    

];
