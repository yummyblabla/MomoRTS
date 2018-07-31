import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@Output() changePage: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private router: Router) { }

	ngOnInit() {
	}

// Emits boolean to change showLogin in MainComponent to go to the Account page
	private goToAccountPage() {
		this.changePage.emit(false);
	}

// Checks credentials to login, then changes route to Lobby
	private login() {

		this.router.navigate(['lobby'], {skipLocationChange: true});
	}
}
