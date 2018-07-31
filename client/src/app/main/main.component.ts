import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

// If true, shows Login, else shows Account-Page
	showLogin: boolean = true;

	constructor() { }

	ngOnInit() {
	}

// Updates showLogin boolean to either display Login or AccountPage
	updateFromChild($event) {
		this.showLogin = $event;
	}
}
