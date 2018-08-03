import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './main/login/login.component';
import { AccountPageComponent } from './main/account-page/account-page.component';
import { LobbyHeaderComponent } from './lobby/lobby-header/lobby-header.component';
import { LobbyBodyComponent } from './lobby/lobby-body/lobby-body.component';
import { LobbyFooterComponent } from './lobby/lobby-footer/lobby-footer.component';
import { LobbyBodyLeftComponent } from './lobby/lobby-body/lobby-body-left/lobby-body-left.component';
import { LobbyBodyMiddleComponent } from './lobby/lobby-body/lobby-body-middle/lobby-body-middle.component';
import { LobbyBodyRightComponent } from './lobby/lobby-body/lobby-body-right/lobby-body-right.component';

import { WebsocketService } from './services/websocket.service';
import { UserInfoService } from './services/user-info.service';
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LobbyComponent,
    GameComponent,
    LoginComponent,
    AccountPageComponent,
    LobbyHeaderComponent,
    LobbyBodyComponent,
    LobbyFooterComponent,
    LobbyBodyLeftComponent,
    LobbyBodyMiddleComponent,
    LobbyBodyRightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [WebsocketService, UserInfoService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
