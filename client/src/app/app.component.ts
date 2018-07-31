import { Component, OnInit } from '@angular/core';
import { MessageParser } from './services/messageparser.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageParser]
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private messageParser: MessageParser) {

  }

  ngOnInit() {
    this.messageParser.messages.subscribe(data => { 
      if (data.type == "text") {
        console.log(data.text)
      }
    })
  }

  sendmsg() {
    this.messageParser.messages.next({type: "message", message: "received!"});
  }

  goToLobby() {
    this.router.navigate(['lobby'], {skipLocationChange: true});
  }

  goToGame() {
    this.router.navigate(['game'], {skipLocationChange: true});
  }

}
