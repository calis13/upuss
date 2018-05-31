import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(
    private http: Http
  ) { }

  //Comm with back end and creates new game
  addNewGame(game) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/game/add', game, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Comm with back end join existing game (creates new entry in GamePlayer)
  joinGame(gamePlayer) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/game/joinGame', gamePlayer, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets All Games for Admin to view and edit
  getAllGames() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/game/getGames', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets All Players for User to view and edit their own games
  getAllPlayers() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/game/gamesPlayers', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Gets Available Games for Players to view
  getAvailableGames() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/game/gameAvailable', { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Remove Game from database
  removeGame(game) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:8080/game/remove', game, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Update Game in database
  updateGame(game) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:8080/game/update', game, { headers: headers })
      .pipe(map(res => res.json()));
  }

  //Remove Player from a Game
  removePlayer(game) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:8080/game/removeFromGame', game, { headers: headers })
      .pipe(map(res => res.json()));
  }
}