import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WebsocketService } from './services/websocket.service';
import { UserInfoService } from './services/user-info.service';
import { AuthGuardService } from './services/auth-guard.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

export class AppComponent implements OnInit {
  constructor(private router: Router, 
              private wsService: WebsocketService,
              private userInfo: UserInfoService) {

  }

  ngOnInit() {
    this.wsService.subject.subscribe((data): any => { 
      if (data["type"] == "text") {
        console.log(data["text"]);
      }
    })
  }

  sendmsg() {
    this.wsService.subject.next({type: "message", message: "received!"});
  }

  goToLobby() {
    this.router.navigate(['lobby'], {skipLocationChange: true});
  }

  goToGame() {
    this.router.navigate(['game'], {skipLocationChange: true});
  }

  goToVerify() {
    this.router.navigate(['mapeditor'], {skipLocationChange: true});
  }
}
