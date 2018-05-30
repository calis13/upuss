import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PusherService } from '../../services/pusher.service';
import { AuthService } from '../../services/auth.service';
import { VotingService } from '../../services/voting.service';
import { ValidateService } from "../../services/validate.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

@Component({
  selector: 'app-fundraising',
  templateUrl: './fundraising.component.html',
  styleUrls: ['./fundraising.component.css']
})
export class FundraisingComponent implements OnInit {

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private validateService: ValidateService,
    private votingService: VotingService,
    private authService: AuthService,
    private http: HttpClient,
    private pusher: PusherService
  ) { }

  user: Object;
  event = 'vote';
  vote = '';
  voted = false;
  submitted = false;
  ideaData: Object;
  allIdeas: Object;
  voteCount: Object;
  currentVotes: number[];
  shortNames: String[];
  arr = Object;

  // voteIdea: Object;
  voteIdeaName: String;
  voteIdeaShortName: String;
  voteIdeaDescription: String;

  // newIdea: Object;
  newIdeaName: String;
  newIdeaDescription: String;

  chartData: number[];
  chartLabels: string[];
  chartType = 'pie';

  //User votes for an idea, goes to voteIdeas route
  castVote(name) {
    this.http
      .post(`http://localhost:8080/voteIdeas/vote`, { name })
      .subscribe((res: any) => {
        this.vote = res.name;
        this.voted = true;
      });
  }

  ngOnInit() {
    //Get proposed ideas to show admin
    this.votingService.getAllIdeas().subscribe(allIdeas => {
      this.allIdeas = allIdeas;
    });

    //Gets ideas to populate voting options
    this.votingService.getIdeas().subscribe(currentIdeas => {
      this.ideaData = currentIdeas;
    },
      err => {
        console.log(err);
        return false;
      });

    //Splits current votes into values and keys for graphing
    this.votingService.getVotes().subscribe(currentVotes => {
      this.arr = currentVotes;
      this.voteCount = {};
      for (var i = 0; i < this.arr.length; i++) {
        for (var key in this.arr[i]) {
          if (typeof this.arr[i][key] != 'function') {
            this.voteCount[key] = this.arr[i][key];
          }
        }
      }
      this.chartLabels = Object.keys(this.voteCount);
      this.chartData = Object.values(this.voteCount);

    },
      err => {
        console.log(err);
        return false;
      });

    //Gets profile for isAdmin options
    this.authService.getProfile().subscribe(currentUser => {
      this.user = currentUser.user;
    },
      err => {
        console.log(err);
        return false;
      });

    //pusher for graph updating
    const channel = this.pusher.init();
    channel.bind('vote', (name) => {
      this.voteCount[name] += 1;
      // Update the chartData whenever there's a new vote
      this.chartData = Object.values(this.voteCount);
    });
  }

  removeIdea(idea) {
    // maybe replace this with a better warning if I get time
    if (confirm('Are you sure?')) {
      this.votingService.removeIdea(idea).subscribe(data => {
        if (data.success) {
          //Get proposed ideas to show admin
          this.votingService.getAllIdeas().subscribe(allIdeas => {
            this.allIdeas = allIdeas;
          });
          this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
          this.router.navigate(['/fundraising']);
        }
        else {
          this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
          this.router.navigate(['/fundraising']);
        }
      });
    }
  }

  //Admin Register Voting Ideas
  onVotingIdeaSubmit() {
    const voteIdea = {
      voteIdeaName: this.voteIdeaName,
      voteIdeaShortName: this.voteIdeaShortName,
      voteIdeaDescription: this.voteIdeaDescription,
    }

    //Required Fields
    if (!this.validateService.validateVoteIdea(voteIdea)) {
      this.flashMessage.show('Please fill in all fields', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      return false;
    }

    //Routes through voting.service to back end
    this.votingService.registerVoteIdea(voteIdea).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('New Fundraising Idea Added', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/fundraising']);
        this.voteIdeaName = '';
        this.voteIdeaShortName = '';
        this.voteIdeaDescription = '';
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.router.navigate(['/fundraising']);
      }
    });
  }

  //User Register NEW Idea
  onNewIdeaSubmit() {
    const newIdea = {
      newIdeaName: this.newIdeaName,
      newIdeaDescription: this.newIdeaDescription,
    }

    //Required Fields
    if (!this.validateService.validateNewIdea(newIdea)) {
      this.flashMessage.show('Please fill in all fields', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      return false;
    }

    //Routes through voting.service to back end
    this.votingService.registerNewIdea(newIdea).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Thanks for your submission!', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.submitted = true;
        this.router.navigate(['/fundraising']);
        this.newIdeaName = '';
        this.newIdeaDescription = '';
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.router.navigate(['/fundraising']);
      }
    });
  }
}