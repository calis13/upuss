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

  //Gets ideas from Voting database
  getIdeas() {
    console.log('GET IDEAS')
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/voteIdeas/ideas', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Adds new entries to voting database
  registerVoteIdea(voteIdea) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/voteIdeas/add', voteIdea, { headers: headers })
      .pipe(map(res => res.json()));
  }
}
