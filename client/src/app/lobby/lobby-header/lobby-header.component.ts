import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-lobby-header',
	templateUrl: './lobby-header.component.html',
	styleUrls: ['./lobby-header.component.css']
})
export class LobbyHeaderComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}

	private logOut() {
		this.router.navigate([''], {skipLocationChange: true});
	}
}
