import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { WebsocketService } from '../services/websocket.service';

@Component({
	selector: 'app-account-verify',
	templateUrl: './account-verify.component.html',
	styleUrls: ['./account-verify.component.css']
})

export class AccountVerifyComponent implements OnInit {

	private accountVerifyChecker;

	constructor(private wsService: WebsocketService,
				private router: Router) { }

// Initializes the account verification listener
	ngOnInit() {
		this.checkForAccountVerification();
	}

// Unsubscribes when the component is destroyed
	ngOnDestroy() {
		this.accountVerifyChecker.unsubscribe();
	}

// Checks for Account verification by initializing a subscriber, then checks url for username and activation code
	public checkForAccountVerification() {
		this.accountVerifyChecker = this.wsService.subject.subscribe((data) => {
	    		if (data["type"] == "account-activated") {
	    			alert("Account activated!");
	    		}
		});

		let pairs = location.search.slice(1).split('&');
    
    	let result = {};
    	pairs.forEach(function(pair) {
        	pairs = pair.split('=');
        	result[pairs[0]] = decodeURIComponent(pairs[1] || '');
    	});

    	console.log(result);
	    let query = JSON.parse(JSON.stringify(result));

	    if ("user" in query && "code" in query) {
	    	
	    	this.wsService.subject.next({
	    		type: "verify-account",
	    		username: query.user,
	    		activationCode: query.code
	    	});
	    	
	    	
		}
	}

	goToLoginPage() {
		this.router.navigate(['']);
	}

}
