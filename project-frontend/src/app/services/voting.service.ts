import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  constructor(
    private http: Http,
  ) { }

  //Remove Idea from user suggestions
  removeIdea(idea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('newIdeas/remove', idea, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Get ALL ideas for admin to view
  getAllIdeas() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('newIdeas/ideas', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets ideas from Voting database
  getIdeas() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('voteIdeas/ideas', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets votes from Voting database
  getVotes() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('voteIdeas/votes', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets Short Names from Voting database
  getShortNames() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('voteIdeas/shortNames', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Comm with back end and adds new entries to current voting database (ADMIN)
  registerVoteIdea(voteIdea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('voteIdeas/add', voteIdea, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Comm with back end and adds new entries to voting future ideas database (USER)
  registerNewIdea(newIdea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('newIdeas/add', newIdea, { headers: headers })
      .pipe(map(res => res.json()));
  }
}
