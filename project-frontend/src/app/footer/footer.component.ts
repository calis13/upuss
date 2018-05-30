import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  modified: Date;
  now: String;

  constructor() {}

  ngOnInit() {
    //Ticking Clock
    let timeoutId = setInterval(() =>{
      var time = new Date();
      this.now = ('0' + time.getHours()).substr(-2) + ":" + ('0' + time.getMinutes()).substr(-2) + ":" + ('0' + time.getSeconds()).substr(-2);
    }, 1000);

    //Modified date
    this.modified = new Date();
}

}
