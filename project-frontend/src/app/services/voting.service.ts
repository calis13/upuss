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

  //Remove New Vote Idea from user suggestions
  removeIdea(idea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:8080/newIdeas/remove', idea, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Remove Current Vote Idea from user suggestions
  removeCurrentIdea(idea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:8080/voteIdeas/remove', idea, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Get ALL ideas for admin to view
  getAllIdeas() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/newIdeas/ideas', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets ideas from Voting database
  getIdeas() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/voteIdeas/ideas', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets votes from Voting database
  getVotes() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/voteIdeas/votes', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets votes from Voting database
  resetVotes(idea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/voteIdeas/reset', idea, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets Short Names from Voting database
  getShortNames() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/voteIdeas/shortNames', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Comm with back end and adds new entries to current voting database (ADMIN)
  registerVoteIdea(voteIdea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/voteIdeas/add', voteIdea, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Comm with back end and adds new entries to voting future ideas database (USER)
  registerNewIdea(newIdea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/newIdeas/add', newIdea, { headers: headers })
      .pipe(map(res => res.json()));
  }
}
