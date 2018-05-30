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
  ideaData: Object;
  voteCount: Object;

  voteIdea: Object;
  voteIdeaName: String;
  voteIdeaShortName: String;
  voteIdeaDescription: String;

  chartLabels: ['football', 'soccer']; //string[] = Object.keys(this.voteCount);
  chartData: number[] = [1,2]; //number[] = Object.values(this.voteCount);
  chartType = 'pie';

  castVote(name) {
    this.http
      .post(`http://localhost:8080/vote`, { name })
      .subscribe((res: any) => {
        this.vote = res.name;
        this.voted = true;
      });
  }

  getVoteClasses(name) {
    return {
      elect: this.voted && this.vote === name,
      lost: this.voted && this.vote !== name,
    };
  }

  ngOnInit() {
    // this.votingService.getIdeas().subscribe(fundRaise => {
    //   this.ideaData = fundRaise.ideaData;
    //   //this.voteCount = fundRaise.voteCount;
    // },
    //   err => {
    //     console.log(err);
    //     return false;
    //   });

    this.votingService.getIdeas().subscribe(currentIdeas => {
      this.ideaData = currentIdeas.ideaData;
    },
      err => {
        console.log(err);
        return false;
      });

    this.authService.getProfile().subscribe(currentUser => {
      this.user = currentUser.user;
    },
      err => {
        console.log(err);
        return false;
      });

    const channel = this.pusher.init();
    channel.bind('vote', (name) => {
      this.voteCount[name] += 1;
      // Update the chartData whenever there's a new vote
      console.log(this.chartData);
      this.chartData = Object.values(this.voteCount);
    });
  }

  onVotingSubmit() {
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

    //Register FR Idea
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

}
