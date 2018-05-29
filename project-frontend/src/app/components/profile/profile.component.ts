import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from "angular2-flash-messages";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  user: Object;
  universities = ['UWA', 'Curtin', 'Notre Dame', 'Edith Cowan', 'Other', 'None'];
  sports = ['Basketball', 'Baseball', 'Softball', 'Cricket', 'Football', 'Soccer'];
  isEdit: boolean = false;


  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      });
  }

  editProfile() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      });
    this.isEdit = true;
  }

  updateProfile() {
    //Update User
    this.authService.updateUser(this.user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Profile updated', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/profile']);
      }
      else {
        this.flashMessage.show('Profile could not be updated', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/profile']);
      }
    });
    this.isEdit = false;
  }
}
