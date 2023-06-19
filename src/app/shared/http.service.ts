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
			if (options.isCount !== false) {
				queryStr += `&$count=true`;
			}
			if (options.top !== undefined && options.top > 0) {
				let top = options.top;
				top = top < 0 ? 1 : top;
				queryStr += `&$top=${top}`;
			}
			if (options.skip !== undefined && options.skip >= 0) {
				let skip = options.skip;
				skip = skip < 0 ? 0 : skip;
				queryStr += `&$skip=${skip}`;
			}
			if (options.select) {
				if (queryStr.length === 0) {
					queryStr += `$select=${options.select}`;
				}
				else {
					queryStr += `&$select=${options.select}`;
				}
			}
			if (options.filter) {
				queryStr += `&$filter=${options.filter}`;
			}
			if (options.sort) {
				queryStr += `&$orderby=${options.sort}`;
			}

			if (options.page) {
				let page = options.page;
				page = page < 0 ? 1 : page;
				queryStr += `&page=${page}`;
			}
			if (options.pageSize) {
				let pageSize = options.pageSize;
				pageSize = pageSize < 0 ? 0 : pageSize;
				queryStr += `&pageSize=${pageSize}`;
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
			if (options.page) {
				let page = options.page;
				page = page < 0 ? 1 : page;
				queryStr += `&page=${page}`;
			}
			if (options.pageSize) {
				let pageSize = options.pageSize;
				pageSize = pageSize < 0 ? 0 : pageSize;
				queryStr += `&pageSize=${pageSize}`;
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

	updateItem<T>(url: string, id: string, item: T): Observable<any> {
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
			headers = headers.set('Content-Type', 'application/json');
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
