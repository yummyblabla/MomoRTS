import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { UserInfoService } from './user-info.service';

@ Injectable()
export class AuthGuardService implements CanActivate {
	constructor(private userInfoService: UserInfoService,
				private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot,
				state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (this.userInfoService.isAuthenticated()) {
			return true;
		} else {
			this.router.navigate([''], {skipLocationChange: true});
			return false;
	}
}