import { Component, OnInit } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from '@angular/router';

import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //What to display?
  displayAll: boolean = true;
  displayMine: boolean = false;
  displayForm: boolean = false;
  displayEdit: boolean = false;

  //Filters game types on selection
  filter: String = 'all';

  allIdeas: Object;
  user: Object;
  allGames: Object;
  availableGames: Object;
  allPlayers: Object;
  currentGame: Object;

  newGameAdminUsername: Object;
  newGameSport: Object;
  newGameVenue: Object;
  newGameDescription: Object;
  newGameplayersRequired: Object;
  newGamerefereesRequired: Object;
  newGamedateTime: Object;

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private gamesService: GamesService,
    private validateService: ValidateService
  ) { }

  ngOnInit() {
    //Get proposed ideas to show admin
    this.gamesService.getAllGames().subscribe(allGames => {
      this.allGames = allGames;
    },
      err => {
        console.log(err);
        return false;
      });

    //Get ALL games to show admin
    this.gamesService.getAllGames().subscribe(allGames => {
      this.allGames = allGames;
    },
      err => {
        console.log(err);
        return false;
      });

    //Get Available games to show users
    this.gamesService.getAvailableGames().subscribe(availableGames => {
      this.availableGames = availableGames;
    },
      err => {
        console.log(err);
        return false;
      });

    //Get ALL Players to populate view
    this.gamesService.getAllPlayers().subscribe(allPlayers => {
      this.allPlayers = allPlayers;
    },
      err => {
        console.log(err);
        return false;
      });

    //Gets current profile
    this.authService.getProfile().subscribe(currentUser => {
      this.user = currentUser.user;
    },
      err => {
        console.log(err);
        return false;
      });
  }

  //This will show the add game form and hide other content.
  showForm() {
    this.displayAll = false;
    this.displayMine = false;
    this.displayForm = true;
    this.displayEdit = false;
  }

  //This will show all games and hide all other content.
  showAll() {
    this.displayAll = true;
    this.displayMine = false;
    this.displayForm = false;
    this.displayEdit = false;
  }

  //This will hide all content besides my games.
  showMine() {
    this.displayAll = false;
    this.displayMine = true;
    this.displayForm = false;
    this.displayEdit = false;
  }

  //This will hide all content besides the edit form.
  showEdit(editGame) {
    this.currentGame = editGame;
    this.displayAll = false;
    this.displayMine = false;
    this.displayForm = false;
    this.displayEdit = true;
    window.scrollTo(0, 0);
  }

  //This function filters the games by sport.
  filterGame(game) {
    if (this.filter == 'all') {
      return true;
    }
    else if (game.sport == this.filter) {
      return true;
    }
    else {
      return false;
    }
  }

  //Return whether the user is the referee for that game.
  isReferee(game) {

    return true;
  }

  //Return whether the user is a player in this game.
  isPlayer(game) {
    return true;
  }

  //Admin Register Voting Ideas
  onGameSubmit(user) {
    window.scrollTo(0, 0);

    const newGame = {
      newGameAdminUsername: user.username,
      newGameSport: this.newGameSport,
      newGameVenue: this.newGameVenue,
      newGameDescription: this.newGameDescription,
      newGameplayersRequired: this.newGameplayersRequired,
      newGamerefereesRequired: this.newGamerefereesRequired,
      newGamedateTime: this.newGamedateTime,
    }

    //Required Fields
    if (!this.validateService.validateNewGame(newGame)) {
      this.flashMessage.show('Please fill in all fields', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      return false;
    }

    //Routes through voting.service to back end
    this.gamesService.addNewGame(newGame).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('New Game Added', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/dashboard']);
        this.newGameAdminUsername = '';
        this.newGameSport = '';
        this.newGameVenue = '';
        this.newGameDescription = '';
        this.newGameplayersRequired = '';
        this.newGamerefereesRequired = '';
        this.newGamedateTime = '';
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.router.navigate(['/fundraising']);
      }
    });
  }
}
