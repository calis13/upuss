import { Component, OnInit, PipeTransform, Pipe, NgModule } from '@angular/core';
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

  getInterests(interests) {
    var ints = [];
    let keys = Object.keys(interests);
    let vals = Object.values(interests);

    for (var i = 0; i < keys.length; i++) {
      if (vals[i] == true) {
        ints.push(keys[i]);
      }
    }

     for (var j = 0; j < ints.length; j++){
       ints[j] = ints[j].charAt(0).toUpperCase() + ints[j].substr(1); 
    }

    return ints.join(", ");
  }
}
