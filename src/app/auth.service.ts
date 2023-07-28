import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, } from "@angular/common/http";
import { EMPTY, Observable } from "rxjs";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { SharedPropertyService } from "./shared/shared-property.service";

@Injectable({
	providedIn: "root",
})
export class AuthenIntercept implements HttpInterceptor {
	constructor(public router: Router,
		public sharedService: SharedPropertyService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let url = req.url;
		//Skip authen
		if (url.includes("/api/v1/auth")) {
			return next.handle(req.clone());
		}
		if (url.startsWith("http://gppc_client")) {
			return next.handle(req.clone());
		}
		else if (url.includes("/public/storage/images")) {
			console.log("imageUrl.......", url);

			return next.handle(req.clone());
		}
		else if (url.includes("/v1/api/public")) {
			return next.handle(req.clone({
				// headers: req.headers
				// 	.set('Domain', 'nos')
			}));
		}
		else if (url.includes('assets/') || url.includes('configs/')) {
			const authReq = req.clone({
				headers: req.headers
					.set('Cache-Control', 'public;max-age=31536000')
			});
			return next.handle(authReq);
		}
		let accessToken = localStorage.getItem('accessToken');
		if (accessToken == null || accessToken == undefined) {
			// console.log('url...', url)
			// console.log("Access Token is empty");
			return EMPTY; ``
		}
		const authReq = req.clone({
			headers: req.headers
				.set("Authorization", `Bearer ${accessToken}`)
				.set('Access-Control-Allow-Origin', 'http://localhost:4200')
		});
		return this.newRequest(next, authReq);
	}

	newRequest(next: HttpHandler, authReq: any) {
		return next.handle(authReq).pipe(tap(event => {
			if (event instanceof HttpResponse) {
			}
		}, error => {
			if (error instanceof HttpErrorResponse) {
				if (error.status === 401) {
					if (!this.sharedService.isPageSkipLogin()) {
						this.sharedService.sharedData({ action: 'user-unauthorized' });
					};
					this.sharedService.sharedData({
						action: "sign-out-when-user-unauthorized",
					});
				}
				else {
					if (error.message.includes('ACCESS_DENIED')) {
						this.router.navigate(['/access-denied']);
					}
				}
			}
		}));
	}
}
