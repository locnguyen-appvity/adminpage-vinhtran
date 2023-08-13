import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpService } from '../shared/http.service';
import { GlobalSettings } from '../shared/global.settings';

@Injectable({
	providedIn: 'root'
})
export class PageService {

	private rootAPI: string = GlobalSettings.Settings.ServerClient + "/api/v1";
	private rootAPIAdmin: string = GlobalSettings.Settings.Server + '/api/v1/admin';
	constructor(public service: HttpService) {
	}

	getItems(url: string, options: any): Observable<any> {
		return this.service.getItems(url, options).pipe(
			map(res => {
				let dataJSON = res;
				let arrs = dataJSON['value'] as any[];
				let total = parseInt(dataJSON['@odata.count'], 10);
				return {
					total: total,
					value: arrs
				};
			}),
			catchError(error => this.handleError('getItems', error))
		);
	}

	searchClergies(options: any): Observable<any> {
		const baseUrl = this.rootAPI + `/clergies/search`;
		return this.getDataItems(baseUrl, options).pipe(catchError(error => this.handleError('searchClergies', error)));
	}

	searchOrganizations(options: any): Observable<any> {
		const baseUrl = this.rootAPI + `/organizations/search`;
		return this.getDataItems(baseUrl, options).pipe(catchError(error => this.handleError('searchOrganizations', error)));
	}

	getGroups(options?: any): Observable<any> {
		let baseUrl = this.rootAPI + '/groups';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getGroups', error)));
	}

	getGroup(id: string, options?: any): Observable<any> {
		let baseUrl = this.rootAPI + '/groups';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getGroup', error)));
	}

	getGroupAnalytics(id: string, options?: any): Observable<any> {
		let baseUrl = this.rootAPI + `/groups/${id}/analytics`;
		return this.service.getItem(baseUrl, null, options).pipe(catchError(error => this.handleError('getGroup', error)));
	}

	getOrganizations(options?: any): Observable<any> {
		let baseUrl = this.rootAPI + '/organizations';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getOrganizations', error)));
	}

	getOrganization(id: string, options?: any): Observable<any> {
		let baseUrl = this.rootAPI + '/organizations';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getOrganization', error)));
	}

	getDataItems(baseUrl, options: any): Observable<any> {
		let pageOption: any = {}
		let restrictions = [];
		let sorts = [];
		if (options) {
			if (options.page) {
				pageOption.page = options.page;
			}
			if (options.pageSize) {
				pageOption.pageSize = options.pageSize;
			}
			if (options.restrictions) {
				restrictions = options.restrictions;
			}
			if (options.sorts) {
				sorts = options.sorts;
			}
		}
		let params = {
			"pageOption": pageOption,
			"restrictions": restrictions,
			"sorts": sorts
		}
		return this.service.postRequestBaseUrl(baseUrl, null, params).pipe(catchError(error => this.handleError('getDataItems', error)));
	}

	getSaints(options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/saints';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getSaints', error)));
	}
	
	getParablesDaily(options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/daily-parables';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getParablesDaily', error)));
	}

	getPositions(options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/positions';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getPositions', error)));
	}

	getAnniversaries(options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/anniversaries';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getAnniversaries', error)));
	}

	getAppointments(options?: any): Observable<any> {
		let baseUrl = this.rootAPI + '/appointments';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getAppointments', error)));
	}

	getClergy(id: string, options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/clergies';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getClergy', error)));
	}

	// Masses
	getMasseses(options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/masses';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getMasseses', error)));
	}

	// Organizations

	getPosts(options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/posts';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getPosts', error)));
	}

	getContemplations(options?: any): Observable<any> {
		let baseUrl = this.rootAPIAdmin + '/contemplations';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getContemplations', error)));
	}

	handleError(methodName: string, errorData: HttpErrorResponse | any) {
		let errorResponse: any = {
			status: 0,
			message: ''
		};
		return throwError(() => new Error(errorResponse.message));
	}

}
