import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './main/login/login.component';
import { AccountPageComponent } from './main/account-page/account-page.component';
import { LobbyHeaderComponent } from './lobby/lobby-header/lobby-header.component';
import { LobbyBodyComponent } from './lobby/lobby-body/lobby-body.component';
import { LobbyFooterComponent } from './lobby/lobby-footer/lobby-footer.component';

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
    LobbyFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
