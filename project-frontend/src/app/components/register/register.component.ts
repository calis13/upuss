import { Component, OnInit } from '@angular/core';
import { ValidateService } from "../../services/validate.service";
import { AuthService } from "../../services/auth.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;
  password2: String;



  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      password2: this.password2
    }

    //Required Fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      return false;
    }

    //Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please enter a valid email', { cssClass: 'align-top alert alert-danger', timeout: 3000 });
      return false;
    }

    //Ensure password match
    if (!this.validateService.passwordsMatch(user.password, user.password2)) {
      this.flashMessage.show('Passwords do not match', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      return false;
    }

    //ADD COMPLEX PASSWORD VALIDATOR HERE

    //Register User
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('You are now registered and can login', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      }
      else {
        this.flashMessage.show('Registration failed', { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.router.navigate(['/register']);
      }
    });
  }
}

