import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { AccountVerifyComponent } from './account-verify/account-verify.component';
import { MapEditorComponent } from './mapeditor/mapeditor.component';

import { AuthGuardService } from './services/auth-guard.service';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'lobby', canActivate: [AuthGuardService], component: LobbyComponent },
  { path: 'game', component: GameComponent },
  { path: 'verify', component: AccountVerifyComponent },
  { path: 'mapeditor', component: MapEditorComponent },
  { path: '**', redirectTo: '' }
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