import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  //Ensure all required user fields are present
  validateRegister(user) {
    if (user.firstName == undefined || user.lastName == undefined || user.username == undefined || user.email == undefined || user.password == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  //Ensure all required user fields are present
  validateVoteIdea(voteIdea) {
    if (voteIdea.voteIdeaName == undefined || voteIdea.voteIdeaShortName == undefined || voteIdea.voteIdeaDescription == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  //Ensure all required user fields are present
  validateNewIdea(newIdea) {
    if (newIdea.newIdeaName == undefined || newIdea.newIdeaDescription == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

    //Ensure all required user fields are present
    validateNewGame(newGame) {
      if (newGame.newGameAdminUsername == undefined || newGame.newGameSport == undefined || newGame.newGameVenue == undefined || newGame.newGameDescription == undefined || newGame.newGameplayersRequired == undefined || newGame.newGamerefereesRequired == undefined || newGame.newGamedateTime == undefined) {
        return false;
      }
      else {
        return true;
      }
    }      

  //Ensure email is valid
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test((email).toLowerCase());
  }

  //Ensure passwords match
  passwordsMatch(password, password2) {
    if (password != password2) {
      return false;
    }
    else {
      return true;
    }
  }
  
  //Ensure password is more than 8 characters, has a capital and a number
  passwordComplex(email) {
    const complex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return complex.test((email));
  }
}