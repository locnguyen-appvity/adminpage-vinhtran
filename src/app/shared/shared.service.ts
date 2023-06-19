import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { GlobalSettings } from './global.settings';
import { HttpService } from './http.service';
import { SharedPropertyService } from './shared-property.service';

@Injectable({
	providedIn: 'root'
})
export class SharedService {

	// private serviceConfig: any = {
	// 	ip: '',
	// 	port: '',
	// 	ready: false
	// };
	constructor(public service: HttpService,
		public shared: SharedPropertyService) {
		// this.getConfigs();
		this.shared.RootEndPointAPI = this.getRootEndPointAPI();
	}

	getRootEndPointAPI() {
		if (environment.production) {
			return "./api/v1";
			// return `${environment.server}/${environment.apiVersion}/api`;
		}
		return GlobalSettings.Settings.Server + '/api/v1';
	}

	isNullOrEmpty(data: any) {
		if (data === null || data === "" || data === undefined) {
			return true;
		}
		return false;
	}

	getRootEndPointAuth() {
		if (environment.production) {
			// if (this.serviceConfig.ready) {
			// 	if (!this.isNullOrEmpty(this.serviceConfig) && !this.isNullOrEmpty(this.serviceConfig.ip)) {
			// 		return `${this.serviceConfig.ip}:${this.serviceConfig.port}/${environment.apiVersion}/auth`;
			// 	}
			// }
			// else {
			// 	let url = `${window.location.origin}/configs/serviceConfig.json`;
			// 	this.service.loadConfigs(url).pipe(take(1)).subscribe({
			// 		next: (serviceConfig: any) => {
			// 			return `${serviceConfig.ip}:${serviceConfig.port}/${environment.apiVersion}/auth`
			// 		}
			// 	})
			// }
			return "./api/auth";
		}
		return GlobalSettings.Settings.Server + '/api/auth';
	}

	createToken(data: any): Observable<any> {
		const baseUrl = this.getRootEndPointAuth() + `/login`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createToken', error)));
	}

	getVerifyAccessToken(token: any): Observable<any> {
		const baseUrl = this.getRootEndPointAuth() + `/me`;
		return this.service.verifyAccessToken(baseUrl, token).pipe(catchError(error => this.handleError('getVerifyAccessToken', error)));
	}

	getAuthors(options?: any): Observable<any> {
		let baseUrl = GlobalSettings.Settings.Server + '/management/authors';
		return this.service.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getAuthors', error)));
	}

	handleError(methodName: string, errorData: HttpErrorResponse | any) {
		let errorResponse: any = {
			status: 0,
			message: ''
		};
		return throwError(() => new Error(errorResponse.message));
	}

}
