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
  displayAll: boolean = false;
  displayMine: boolean = false;
  displayForm: boolean = false;
  displayEdit: boolean = false;
  detailedView: boolean = false;

  loaded: boolean = false;

  //Filters game types on selection
  filter: String = 'all';

  allIdeas: Object;
  username: String;
  user: Object;
  allGames: Object;
  availableGames: Object;
  allPlayers: Object;
  currentGame: Object;
  detailedGame: Object;
  playerInGames: Object = {};
  playerRoleInGames: Object = {};
  playerGameRole: Object;
  playerInX: number = 0;

  userGames: Object;
  remainingGames: Object;

  newGameAdminEmail: String;
  newGameAdminUsername: String;
  newGameSport: String;
  newGameVenue: String;
  newGameDescription: String;
  newGamePlayersRequired: String;
  newGameRefereesRequired: String;
  newGameDateTime: String;

  constructor(
    private router: Router,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private gamesService: GamesService,
    private validateService: ValidateService
  ) { }

  ngOnInit() {
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

    //Gets current profile
    this.authService.getProfile().subscribe(currentUser => {
      this.user = currentUser.user;
      this.username = currentUser.user.username;
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
  showAll(user) {
    this.displayAll = true;
    this.displayMine = false;
    this.displayForm = false;
    this.displayEdit = false;

    //Get ALL Players to populate view
    this.gamesService.getAllPlayers().subscribe(allPlayers => {
      var i = allPlayers.length;
      while (i--) {
        if (user.username === allPlayers[i].playerUsername) {
          this.playerInGames[i] = allPlayers[i].gameID;
          this.playerRoleInGames[i] = allPlayers[i].playerRole;
          this.playerInX += 1;
        }
      }

      this.loaded = true;
    },
      err => {
        console.log(err);
        return false;
      });
    return this.playerInGames;
  }

  //Check if player is in game
  inThisGame(game) {
    for (var i = 0; i < this.playerInX; i++) {
      if (game._id === this.playerInGames[i]) {
        return true;
      }
    }
  }

  //What Role is user?
  whatRole(game) {
    var i = this.playerInX;
    while (i--) {
      if (game._id === this.playerInGames[i]) {
        return this.playerRoleInGames[i];
      }
    }
    return 'Admin';
  }

  //This will hide all content besides my games.
  showMine(user) {
    this.displayAll = false;
    this.displayMine = true;
    this.displayForm = false;
    this.displayEdit = false;

    //Get ALL Player's games to populate view
    this.gamesService.getAllPlayers().subscribe(allPlayers => {
      var i = allPlayers.length;
      while (i--) {
        if (user.username === allPlayers[i].playerUsername) {
          this.playerInGames[i] = allPlayers[i].gameID;
          this.playerRoleInGames[i] = allPlayers[i].playerRole;
          this.playerInX += 1;
        }
      }
      this.loaded = true;
    },
      err => {
        console.log(err);
        return false;
      });
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

  //Admin Register Voting Ideas
  onGameSubmit(user) {
    window.scrollTo(0, 0);
    const newGame = {
      newGameAdminUsername: user.username,
      newGameAdminEmail: user.email,
      newGameSport: this.newGameSport,
      newGameVenue: this.newGameVenue,
      newGameDescription: this.newGameDescription,
      newGamePlayersRequired: this.newGamePlayersRequired,
      newGameRefereesRequired: this.newGameRefereesRequired,
      newGameDateTime: this.newGameDateTime,
    }
    //Required Fields
    if (!this.validateService.validateNewGame(newGame)) {
      this.flashMessage.show('Please fill in all fields', { cssClass: 'align-bottom alert alert-danger', timeout: 3000 });
      return false;
    }

    //Validate Date
    if (!this.validateService.validateDate(newGame.newGameDateTime)) {
      this.flashMessage.show('Please enter date and time dd/mm/yyyy hh:mm', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
      return false;
    }

    //Routes through voting.service to back end
    this.gamesService.addNewGame(newGame).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('New Game Added', { cssClass: 'align-top alert alert-success', timeout: 3000 });

        //Reload ALL games to show admin
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
        this.newGameAdminUsername = '';
        this.newGameAdminEmail = '',
          this.newGameSport = '';
        this.newGameVenue = '';
        this.newGameDescription = '';
        this.newGamePlayersRequired = '';
        this.newGameRefereesRequired = '';
        this.newGameDateTime = '';

        //Get ALL Players to populate view
        this.gamesService.getAllPlayers().subscribe(allPlayers => {
          var i = allPlayers.length;
          while (i--) {
            if (user.username === allPlayers[i].playerUsername) {
              this.playerInGames[i] = allPlayers[i].gameID;
              this.playerRoleInGames[i] = allPlayers[i].playerRole;
              this.playerInX += 1;
            }
            this.loaded = true;
          }
        },
          err => {
            console.log(err);
            return false;
          });

        this.router.navigate(['/dashboard']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  showDetailed(game) {
    this.detailedView = true;
    this.detailedGame = {
      sport: game.sport,
      adminName: game.adminUsername,
      email: game.adminEmail,
      venue: game.venue,
      description: game.description,
      dateTime: game.dateTime,
      playersRequired: game.playersRequired,
      refereesRequired: game.refereesRequired
    }
  }

  detailOff() {
    this.detailedView = false;
  }

  deleteGame(game) {
    window.scrollTo(0, 0);
    this.gamesService.removeGame(game).subscribe(data => {
      if (data.success) {
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

        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/dashboard']);
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'align-top alert alert-danger', timeout: 3000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  //Update Game database entry through the backend
  onGameEdit() {
    this.gamesService.updateGame(this.currentGame).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Game updated', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        this.router.navigate(['/dashboard']);
      }
      else {
        this.flashMessage.show('Game could not be updated', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/dashboard']);
      }
    });
    this.displayAll = true;
    this.displayMine = false;
    this.displayForm = false;
    this.displayEdit = false;
  }

  joinGame(game, role, user) {
    window.scrollTo(0, 0);
    const newJoinGame = {
      adminUsername: game.adminUsername,
      gameID: game._id,
      playerUsername: this.username,
      playerRole: role
    }

    this.gamesService.joinGame(newJoinGame).subscribe(data => {
      if (data.success) {
        //Get Available games to show users
        this.gamesService.getAvailableGames().subscribe(availableGames => {
          this.availableGames = availableGames;
        },
          err => {
            console.log(err);
            return false;
          });
        this.flashMessage.show('You have joined - Have Fun!', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        //Get ALL Players to populate view
        this.gamesService.getAllPlayers().subscribe(allPlayers => {
          var i = allPlayers.length;
          while (i--) {
            if (user.username === allPlayers[i].playerUsername) {
              this.playerInGames[i] = allPlayers[i].gameID;
              this.playerRoleInGames[i] = allPlayers[i].playerRole;
              this.playerInX += 1;
            }
            this.loaded = true;
          }
        },
          err => {
            console.log(err);
            return false;
          });
        this.router.navigate(['/dashboard']);
      }
      else {
        this.flashMessage.show('Something went wrong, please try again', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  // Allow user to leave game
  leaveGame(game, role, user) {
    const removePlayer = {
      player: user.username,
      gameID: game._id,
      playerRole: role
    }
    this.gamesService.removePlayer(removePlayer).subscribe(data => {
      if (data.success) {
        //Get Available games to show users
        this.gamesService.getAvailableGames().subscribe(availableGames => {
          this.availableGames = availableGames;
        },
          err => {
            console.log(err);
            return false;
          });
        this.flashMessage.show('You have left - Sorry to see you go!', { cssClass: 'align-top alert alert-success', timeout: 3000 });
        //Get Available games to show users
        this.gamesService.getAvailableGames().subscribe(availableGames => {
          this.availableGames = availableGames;
        },
          err => {
            console.log(err);
            return false;
          });

        //Get ALL Players games to populate view
        this.gamesService.getAllPlayers().subscribe(allPlayers => {
          var i = allPlayers.length;
          this.playerInX = 0;
          while (i--) {
            if (user.username === allPlayers[i].playerUsername) {
              this.playerInGames[i] = allPlayers[i].gameID;
              this.playerRoleInGames[i] = allPlayers[i].playerRole;
              this.playerInX += 1;
            }
          }
        },
          err => {
            console.log(err);
            return false;
          });
        this.router.navigate(['/dashboard']);
      }
      else {
        this.flashMessage.show('Something went wrong, please try again', { cssClass: 'align-top alert alert-danger', timeout: 5000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }
}