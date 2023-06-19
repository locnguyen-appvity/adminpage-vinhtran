import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})

export class HttpService {
	constructor(public http: HttpClient) {
	}

	getItems<T>(url: string, options?: any): Observable<HttpResponse<T>> {
		let headers = new HttpHeaders();
		let queryStr = "";
		if (options) {
			queryStr = `$count=true`;
			if (options.top) {
				let top = options.top;
				top = top < 0 ? 1 : top;
				queryStr += `&$top=${top}`;
			}
			if (options.skip) {
				let skip = options.skip;
				skip = skip < 0 ? 0 : skip;
				queryStr += `&$skip=${skip}`;
			}
			if (options.select) {
				queryStr += `&$select=${options.select}`;
			}
			if (options.sort) {
				queryStr += `&$orderby=${options.sort}`;
			}
			if (options.filter) {
				queryStr += `&$filter=${options.filter}`;
			}
			if (options.expand) {
				queryStr += `&$expand=${options.expand}`;
			}
			if (options.xTextSearch) {
				headers = headers.set("xTextSearch", options.xTextSearch);
			}
			if (options.xTop) {
				headers = headers.set("xTop", options.xTop);
			}
			if (options.xSkip) {
				headers = headers.set("xSkip", options.xSkip);
			}
			if (options.fromDate) {
				headers = headers.set("FromDate", options.fromDate);
			}
			if (options.toDate) {
				headers = headers.set("ToDate", options.toDate);
			}
			if (options.dateOfBirth) {
				headers = headers.set("DateOfBirth", options.dateOfBirth);
			}
		}
		let baseUrl = `${url}`;
		if (queryStr) {
			baseUrl = `${url}?${queryStr}`;
		}
		return this.http.get<HttpResponse<T>>(baseUrl, { headers: headers });
	}

	getItem<T>(url: string, id?: string, options?: any): Observable<T> {
		let headers = new HttpHeaders();
		if (id) {
			url = url + "/" + id + "";
		}
		let queryStr = "";
		if (options) {
			queryStr = `$count=true`;
			if (options.top) {
				let top = options.top;
				top = top < 0 ? 1 : top;
				queryStr += `&$top=${top}`;
			}
			if (options.skip) {
				let skip = options.skip;
				skip = skip < 0 ? 0 : skip;
				queryStr += `&$skip=${skip}`;
			}
			if (options.select) {
				queryStr += `&$select=${options.select}`;
			}
			if (options.sort) {
				queryStr += `&$orderby=${options.sort}`;
			}
			if (options.filter) {
				queryStr += `&$filter=${options.filter}`;
			}
			if (options.expand) {
				queryStr += `&$expand=${options.expand}`;
			}
		}
		let baseUrl = `${url}`;
		if (queryStr) {
			baseUrl = `${url}?${queryStr}`;
		}
		return this.http.get<T>(baseUrl, { headers: headers });
	}

	loadConfigs<T>(url: string): Observable<T> {
		return this.http.get<T>(url);
	}

	verifyAccessToken<T>(url: string, token: any): Observable<T> {
		let headers = new HttpHeaders();
		headers = headers.set("Authorization", token);
		headers = headers.set('Domain', 'nos');
		return this.http.get<T>(url, { headers: headers });
	}

	updateItem<T>(url: string, item: T, id: string): Observable<any> {
		let headers = new HttpHeaders();
		let baseUrl = `${url}`;
		if (id !== null && id !== undefined) {
			baseUrl = `${url}/${id}`;
		}
		return this.http.patch(baseUrl, item, { headers: headers });
	}

	deleteItem<T>(url: string, id?: string): Observable<T> {
		let headers = new HttpHeaders();
		let baseUrl = `${url}`;
		if (id !== null && id !== undefined) {
			baseUrl = `${url}/${id}`;
		}
		return this.http.delete<T>(baseUrl, { headers: headers });
	}

	createItem(url: string, params: any): Observable<any> {
		let headers = new HttpHeaders();
		if (params !== null && params !== undefined) {
			return this.http.post(url, params, { headers: headers });
		}
		return this.http.post(url, {}, { headers: headers });
	}

	postRequestBaseUrl(url: string, headers: HttpHeaders, params?: any): Observable<any> {
		if (headers === null) {
			headers = new HttpHeaders();
			headers = headers.set('Content-Type',  'application/json');
		}
		if (params !== null && params !== undefined) {
			return this.http.post(url, params, { headers: headers });
		}
		return this.http.post(url, {}, { headers: headers });
	}

	uploadFile(url: string, formData: any): Observable<any> {
		let headers = new HttpHeaders();
		if (formData !== null && formData !== undefined) {
			return this.http.post(url, formData, { headers: headers });
		}
		return this.http.post(url, {}, { headers: headers });
	}

}
