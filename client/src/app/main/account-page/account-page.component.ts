import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
	@Output() changePage: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor() { }

	ngOnInit() {
	}

// Emits boolean to change showLogin in MainComponent to go to the Login page
	goToLogin() {
		this.changePage.emit(true);
	}
}
