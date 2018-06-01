import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(
    private http: Http,
    private jwtHelperService: JwtHelperService
  ) { }

  //Connects to back end to add new user to db
  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/register', user, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //connects to backend to alter existing user details
  updateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('users/update', user, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Checks username and password on login
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/authenticate', user, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Retrieves profile from backend
  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('users/profile', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets username from local storage for display in navbar
  getCurrentUserName(){
    if (localStorage.getItem('user')){
      return JSON.parse(localStorage.getItem('user')).username;
    }
    else{
      return "";
    }
  }
  
  //Stores username and token (1 hour limit)
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  //get token 
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    const token: string = this.jwtHelperService.tokenGetter()

    if (!token) {
      return false
    }

    const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token)

    return !tokenExpired
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}

