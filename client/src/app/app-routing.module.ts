import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'game', component: GameComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [
		RouterModule
	]
})

export class AppRoutingModule {}