import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { WebsocketService } from '../../services/websocket.service';
import { UserInfoService } from '../../services/user-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	@Output() changePage: EventEmitter<boolean> = new EventEmitter<boolean>();

	private userLoginForm: FormGroup;
	private username: FormControl;
	private passwordInput: FormControl;


	private loginChecker; // wsService subscriber

	constructor(private router: Router,
				private wsService: WebsocketService,
				private userInfoService: UserInfoService) { }

	ngOnInit() {
// Creates form controls and groups for log-in information
		this.createFormControls();
		this.createFormGroup();
// Initializes the log-in subscriber
		this.checkLogin();
	}

// Emits boolean to change showLogin in MainComponent to go to the Account page
	private goToAccountPage() {
		this.changePage.emit(false);
	}

// Checks credentials to login, then changes route to Lobby
	private beginLogin() {
		let data = {
			type: "begin-login",
			username: this.username.value
		}
		this.wsService.subject.next(data);
		this.router.navigate(['lobby'], {skipLocationChange: true});
	}

// Listener to check for confirmation of login
	private checkLogin() {
		this.loginChecker = this.wsService.subject.subscribe(data => { 
 			if (data["type"] == "login-token") {
 				let hashedPW = this.wsService.hash(this.wsService.hash(this.passwordInput.value + data["salt"]) + data["token"]);
 				this.wsService.subject.next({
 					type: "login",
 					username: this.username.value,
 					value: hashedPW
 				})
 			} else if (data["type"] == "logged-in") {
 					this.userInfoService.login();
				} else if (data["type"] == "bad-login") {
					alert("Incorrect username or password!");
				} else if (data["type"] == "already-logged-in") {
					alert("User is already logged in!");
				}
		})
	}

// Initiates the FormControls
	private createFormControls() {
		this.username = new FormControl('', { validators: 
			[ Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]});
		this.passwordInput = new FormControl('', { validators: 
			[ Validators.required]});
	}

// Appends the FormControls to FormGroup
	private createFormGroup() {
		this.userLoginForm = new FormGroup({
			'username': this.username,
			'password': this.passwordInput,
		});
	}

	ngOnDestroy() {
// Removes the WebSocket subscription upon destroying component
		this.loginChecker.unsubscribe();
	}
}