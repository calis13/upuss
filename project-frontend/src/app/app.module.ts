//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import {ChartsModule} from 'ng2-Charts';
import { FlashMessagesModule } from 'angular2-flash-messages';

//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AboutComponent } from './components/about/about.component';
import { FundraisingComponent } from './components/fundraising/fundraising.component';
import { FooterComponent } from './components/footer/footer.component';
import { DaveComponent } from './components/dave/dave.component';
import { AngusComponent } from './components/angus/angus.component';
import { ReferencesComponent } from './components/references/references.component';
import { ArchitectureComponent } from './components/architecture/architecture.component';

//Services
import { PusherService } from './services/pusher.service';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { VotingService } from './services/voting.service';
import { GamesService } from './services/games.service';

//Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'fundraising', component: FundraisingComponent, canActivate:[AuthGuard] },
  { path: 'angus', component: AngusComponent },
  { path: 'dave', component: DaveComponent },
  { path: 'references', component: ReferencesComponent },
  { path: 'architecture', component: ArchitectureComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    NotFoundComponent,
    AboutComponent,
    FundraisingComponent,
    FooterComponent,
    DaveComponent,
    AngusComponent,
    ReferencesComponent,
    ArchitectureComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('id_token');
        },
        whitelistedDomains: ['/']
      }
    })
  ],
  providers: [ValidateService, AuthService, AuthGuard, PusherService, GamesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
