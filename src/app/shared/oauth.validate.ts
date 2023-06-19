import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class OAuthValidate implements CanActivate {
    constructor(public router: Router) {
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        let accessToken = localStorage.getItem('accessToken');
        if (!this.isNullOrEmpty(accessToken)) {
            return true;
        }
        else {
            this.router.navigate(['/login'])
           return false
        }
    }

    isNullOrEmpty(data: any) {
		if (data === null || data === "" || data === undefined) {
			return true;
		}
		return false;
	}
}
