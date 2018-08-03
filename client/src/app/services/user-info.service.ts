import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class UserInfoService {
	constructor(private router: Router) { }

	private loggedIn = false;



// Checks if the client has been logged in
	isAuthenticated() {
		return this.loggedIn;
	}

	login() {
		this.loggedIn = true;
		this.router.navigate(['lobby'], {skipLocationChange: true});
	}

	logout() {
		this.loggedIn = false;
	}
}
