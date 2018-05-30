import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PusherService } from '../../services/pusher.service';

@Component({
  selector: 'app-fundraising',
  templateUrl: './fundraising.component.html',
  styleUrls: ['./fundraising.component.css']
})
export class FundraisingComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private pusher: PusherService
  ) { }

  event = 'vote';
  vote = '';
  voted = false;
  ideaData = [
    {
      name: 'Raffle',
      shortName: 'raffle',
      description: 'We can sell tickets to the local community'
    },
    {
      name: 'Charity Match',
      shortName: 'football',
      description: 'Football match with $2 entry tickets',
    },
    {
      name: 'Carwash',
      shortName: 'cars',
      description: 'Wash cars for $5 each',
    },
    {
      name: 'Dog Wash',
      shortName: 'dogs',
      description: "Everyone loves dogs! Let's wash them for $$$'s!",
    },
  ];
  voteCount = {
    raffle: 0,
    football: 0,
    cars: 0,
    dogs: 0,
  };

  chartLabels: string[] = Object.keys(this.voteCount);
  chartData: number[] = Object.values(this.voteCount);
  chartType = 'doughnut';

  castVote(name) {
    this.http
      .post(`vote`, { name })
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
    const channel = this.pusher.init();
    channel.bind('vote', ({ player }) => {
      this.voteCount[player] += 1;
    });

    // Update the chartData whenever there's a new vote
    this.chartData = Object.values(this.voteCount);
  }

}
