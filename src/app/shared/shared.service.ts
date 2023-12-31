import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
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
			return "./api/v1/admin";
			// return `${environment.server}/${environment.apiVersion}/api`;
		}
		return GlobalSettings.Settings.Server + '/api/v1/admin';
	}

	isNullOrEmpty(data: any) {
		if (data === null || data === "" || data === undefined) {
			return true;
		}
		return false;
	}

	/**
	 * downloadFileAsBlob
	 
	* download file in 360Aware or Exxon
	* @returns Observable<any>
	*/
	downloadFileAsBlob(url: string): Observable<any> {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/octet-stream');
		return this.service.http.get(url, { headers: headers, observe: 'response', responseType: 'arraybuffer' });
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
			return "./api/v1/auth";
		}
		return GlobalSettings.Settings.Server + '/api/v1/auth';
	}

	createToken(data: any): Observable<any> {
		const baseUrl = this.getRootEndPointAuth() + `/login`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createToken', error)));
	}

	// getVerifyAccessToken(token: any): Observable<any> {
	// 	const baseUrl = this.getRootEndPointAuth() + `/me`;
	// 	return this.service.verifyAccessToken(baseUrl, token).pipe(catchError(error => this.handleError('getVerifyAccessToken', error)));
	// }
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

	//Categories
	getCategories(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/categories';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getCategories', error)));
	}

	getCategory(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/categories';
		return this.service.getItem(baseUrl, options).pipe(catchError(error => this.handleError('getCategory', error)));
	}

	createCategory(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/categories`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createCategory', error)));
	}

	updateCategory(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/categories`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateCategory', error)));
	}

	deleteCategory(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/categories`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteCategory', error)));
	}

	//Catalogues
	getCatalogues(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/catalogues';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getCatalogues', error)));
	}

	getCatalog(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/catalogues';
		return this.service.getItem(baseUrl, options).pipe(catchError(error => this.handleError('getCatalog', error)));
	}

	createCatalog(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/catalogues`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createCatalog', error)));
	}

	updateCatalog(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/catalogues`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateCatalog', error)));
	}

	deleteCatalog(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/catalogues`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteCatalog', error)));
	}

	//Tags
	getTags(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/tags';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('geTags', error)));
	}

	getTag(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/tags';
		return this.service.getItem(baseUrl, options).pipe(catchError(error => this.handleError('getTag', error)));
	}

	createTag(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/tags`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createTag', error)));
	}

	updateTag(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/tags`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateTag', error)));
	}

	deleteTag(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/tags`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteTag', error)));
	}

	//Authors
	getAuthors(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/authors';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('geTags', error)));
	}

	getAuthor(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/authors';
		return this.service.getItem(baseUrl, options).pipe(catchError(error => this.handleError('getAuthor', error)));
	}

	createAuthor(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/authors`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createAuthor', error)));
	}

	updateAuthor(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/authors`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateAuthor', error)));
	}

	deleteAuthor(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/authors`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteAuthor', error)));
	}

	//Users
	getUsers(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/users';
		return this.service.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getUsers', error)));
	}

	getUser(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/users';
		return this.service.getItem(baseUrl, options).pipe(catchError(error => this.handleError('getUser', error)));
	}

	createUser(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/users`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createUser', error)));
	}

	updateUser(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/users`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateUser', error)));
	}

	deleteUser(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/users`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteUser', error)));
	}

	//Posts
	getPosts(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/posts';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getPosts', error)));
	}

	getPost(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/posts';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getPost', error)));
	}

	createPost(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/posts`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createPost', error)));
	}

	updatePost(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/posts`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updatePost', error)));
	}

	deletePost(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/posts`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deletePost', error)));
	}

	//Episodes
	getEpisodes(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/episodes';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getEpisodes', error)));
	}

	getEpisode(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/episodes';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getEpisode', error)));
	}

	createEpisode(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/episodes`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createEpisode', error)));
	}

	updateEpisode(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/episodes`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateEpisode', error)));
	}

	deleteEpisode(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/episodes`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteEpisode', error)));
	}

	//Chapters
	getChapters(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/chapters';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getChapters', error)));
	}

	getChapter(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/chapters';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getChapter', error)));
	}

	createChapter(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/chapters`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createChapter', error)));
	}

	updateChapter(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/chapters`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateChapter', error)));
	}

	deleteChapter(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/chapters`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteChapter', error)));
	}

	//Books
	getBooks(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/books';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getBooks', error)));
	}

	getBook(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/books';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getBook', error)));
	}

	createBook(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/books`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createBook', error)));
	}

	updateBook(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/books`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateBook', error)));
	}

	deleteBook(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/books`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteBook', error)));
	}

	//Slides
	getSlides(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/slides';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getSlides', error)));
	}

	getSlide(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/slides';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getSlide', error)));
	}

	createSlide(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/slides`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createSlide', error)));
	}

	updateSlide(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/slides`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateSlide', error)));
	}

	deleteSlide(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/slides`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteSlide', error)));
	}

	//Parables
	getParables(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/parables';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getParables', error)));
	}

	getParable(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/parables';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getParable', error)));
	}

	createParable(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/parables`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createParable', error)));
	}

	updateParable(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/parables`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateParable', error)));
	}

	deleteParable(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/parables`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteParable', error)));
	}

	//Parables daily
	getParablesDaily(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/daily-parables';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getParablesDaily', error)));
	}

	getParableDaily(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/daily-parables';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getParableDaily', error)));
	}

	createParableDaily(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/daily-parables`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createParableDaily', error)));
	}

	updateParableDaily(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/daily-parables`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateParableDaily', error)));
	}

	deleteParableDaily(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/daily-parables`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteParableDaily', error)));
	}

	//ScheduleEvents
	getScheduleEvents(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/schedule-events';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getScheduleEvents', error)));
	}

	getScheduleEvent(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/schedule-events';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getScheduleEvent', error)));
	}

	createScheduleEvent(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/schedule-events`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createScheduleEvent', error)));
	}

	updateScheduleEvent(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/schedule-events`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateScheduleEvent', error)));
	}

	deleteScheduleEvent(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/schedule-events`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteScheduleEvent', error)));
	}

	//NotificationPosts
	getNotificationPosts(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/notification-posts';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getNotificationPosts', error)));
	}

	getNotificationPost(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/notification-posts';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getNotificationPost', error)));
	}

	createNotificationPost(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/notification-posts`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createNotificationPost', error)));
	}

	updateNotificationPost(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/notification-posts`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateNotificationPost', error)));
	}

	deleteNotificationPost(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/notification-posts`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteNotificationPost', error)));
	}

	//contemplations
	getContemplations(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/contemplations';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getContemplations', error)));
	}

	getContemplation(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/contemplations';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getContemplation', error)));
	}

	createContemplation(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/contemplations`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createContemplation', error)));
	}

	updateContemplation(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/contemplations`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateContemplation', error)));
	}

	deleteContemplation(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/contemplations`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteContemplation', error)));
	}

	//folders
	getFolders(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/folders';
		return this.service.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getFolders', error)));
	}

	getFolder(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/folders';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getFolder', error)));
	}

	getFolderFiles(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/folderFiles';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getFolder', error)));
	}

	createFolder(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/folders`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createFolder', error)));
	}

	updateFolder(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/folders`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateFolder', error)));
	}

	deleteFolder(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/folders`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteFolder', error)));
	}

	//files
	getFiles(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/files';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getFiles', error)));
	}

	getFile(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/files';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getFile', error)));
	}

	createFile(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/files`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createFile', error)));
	}

	deleteFile(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/files`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteFile', error)));
	}

	//EntityFile
	getEntityFiles(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/entityFiles';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getEntityFiles', error)));
	}

	getEntityFile(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/entityFiles';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getEntityFile', error)));
	}

	createEntityFile(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/entityFiles`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createEntityFile', error)));
	}

	deleteEntityFile(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/entityFiles`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteEntityFile', error)));
	}

	//EntityFolders
	getEntityFolders(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/entityFolders';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getEntityFolders', error)));
	}

	getEntityFolder(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/entityFolders';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getEntityFolder', error)));
	}

	createEntityFolder(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/entityFolders`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createEntityFolder', error)));
	}

	updateEntityFolder(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/entityFolders`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateEntityFolder', error)));
	}

	deleteEntityFolder(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/entityFolders`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteEntityFolder', error)));
	}

	//mediafiles
	getMediaFiles(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/mediafiles';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getFiles', error)));
	}

	getMediaFile(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/mediafiles';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getMediaFile', error)));
	}

	createMediaFile(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/mediafiles`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createMediaFile', error)));
	}

	updateMediaFile(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/mediafiles`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateMediaFile', error)));
	}

	deleteMediaFile(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/mediafiles`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteMediaFile', error)));
	}

	// saints
	getSaints(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/saints';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getSaints', error)));
	}

	getSaint(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/saints';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getSaint', error)));
	}

	createSaint(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/saints`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createSaint', error)));
	}

	updateSaint(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/saints`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateSaint', error)));
	}

	deleteSaint(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/saints`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteSaint', error)));
	}

	// clergies
	getClergies(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/clergies';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getClergies', error)));
	}

	getClergy(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/clergies';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getClergy', error)));
	}

	createClergy(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/clergies`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createClergy', error)));
	}

	updateClergy(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/clergies`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateClergy', error)));
	}

	deleteClergy(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/clergies`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteClergy', error)));
	}

	// anniversaries
	getAnniversaries(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/anniversaries';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getAnniversaries', error)));
	}

	getAnniversary(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/anniversaries';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getAnniversary', error)));
	}

	createAnniversary(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/anniversaries`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createAnniversary', error)));
	}

	updateAnniversary(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/anniversaries`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateAnniversary', error)));
	}

	deleteAnniversary(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/anniversaries`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteAnniversary', error)));
	}

	// Organizations
	getOrganizations(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/organizations';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getOrganizations', error)));
	}

	getOrganization(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/organizations';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getOrganization', error)));
	}

	createOrganization(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/organizations`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createOrganization', error)));
	}

	updateOrganization(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/organizations`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateOrganization', error)));
	}

	deleteOrganization(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/organizations`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteOrganization', error)));
	}

	// dioceses
	getDioceses(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/dioceses';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getDioceses', error)));
	}

	getDiocese(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/dioceses';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getDiocese', error)));
	}

	createDiocese(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/dioceses`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createDiocese', error)));
	}

	updateDiocese(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/dioceses`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateDiocese', error)));
	}

	deleteDiocese(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/dioceses`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteDiocese', error)));
	}

	// Migrations
	getMigrations(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/clergyMigrations';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getMigrations', error)));
	}

	getMigration(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/clergyMigrations';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getMigration', error)));
	}

	createMigration(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/clergyMigrations`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createMigration', error)));
	}

	updateMigration(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/clergyMigrations`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateMigration', error)));
	}

	deleteMigration(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/clergyMigrations`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteMigration', error)));
	}

	// groups
	getGroups(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/groups';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getGroups', error)));
	}

	getGroup(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/groups';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getGroup', error)));
	}

	createGroup(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/groups`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createGroup', error)));
	}

	updateGroup(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/groups`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateGroup', error)));
	}

	deleteGroup(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/groups`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteGroup', error)));
	}

	// positions
	getPositions(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/positions';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getPositions', error)));
	}

	getPosition(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/positions';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getPosition', error)));
	}

	createPosition(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/positions`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createPosition', error)));
	}

	updatePosition(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/positions`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updatePosition', error)));
	}

	deletePosition(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/positions`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deletePosition', error)));
	}

	// Masses
	getMasseses(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/masses';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getMasseses', error)));
	}

	getMasses(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/masses';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getMasses', error)));
	}

	createMasses(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/masses`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createMasses', error)));
	}

	updateMasses(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/masses`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateMasses', error)));
	}

	deleteMasses(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/masses`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteMasses', error)));
	}

	getPodbeanEpisodes(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/podbeanEpisodes';
		return this.service.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getPodbeanEpisodes', error)));
	}

	// Appointments
	getAppointments(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/appointments';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getAppointments', error)));
	}

	getAppointment(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/appointments';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getAppointment', error)));
	}

	createAppointment(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/appointments`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createAppointment', error)));
	}

	updateAppointment(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/appointments`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateAppointment', error)));
	}

	approveAppointment(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/appointments/${id}/approve`;
		return this.service.updateItem(baseUrl, null, {}).pipe(catchError(error => this.handleError('updateAppointment', error)));
	}

	finishAppointment(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/appointments/${id}/finish`;
		return this.service.updateItem(baseUrl, null, data).pipe(catchError(error => this.handleError('updateAppointment', error)));
	}

	deleteAppointment(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/appointments`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteAppointment', error)));
	}

	// Layouts
	getLayouts(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/layouts';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getLayouts', error)));
	}

	getLayout(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/layouts';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getLayout', error)));
	}

	createLayout(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/layouts`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createLayout', error)));
	}

	updateLayout(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/layouts`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateLayout', error)));
	}

	deleteLayout(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/layouts`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteLayout', error)));
	}

	// Widgets
	getWidgets(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/widgets';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getWidgets', error)));
	}

	getWidget(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/widgets';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getWidget', error)));
	}

	createWidget(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/widgets`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createWidget', error)));
	}

	updateWidget(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/widgets`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateWidget', error)));
	}

	deleteWidget(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/widgets`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteWidget', error)));
	}

	// WorkspaceSettings
	getWorkspaceSettings(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/workspace-settings';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getWorkspaceSettings', error)));
	}

	getWorkspaceSetting(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/workspace-settings';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getWorkspaceSetting', error)));
	}

	createWorkspaceSetting(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/workspace-settings`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createWorkspaceSetting', error)));
	}

	updateWorkspaceSetting(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/workspace-settings`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateWorkspaceSetting', error)));
	}

	deleteWorkspaceSetting(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/workspace-settings`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteWorkspaceSetting', error)));
	}

	// MainMenus
	getMainMenus(options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/main-menus';
		return this.getItems(baseUrl, options).pipe(catchError(error => this.handleError('getMainMenus', error)));
	}

	getMainMenu(id: string, options?: any): Observable<any> {
		let baseUrl = this.shared.RootEndPointAPI + '/main-menus';
		return this.service.getItem(baseUrl, id, options).pipe(catchError(error => this.handleError('getMainMenu', error)));
	}

	createMainMenu(data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/main-menus`;
		return this.service.postRequestBaseUrl(baseUrl, null, data).pipe(catchError(error => this.handleError('createMainMenu', error)));
	}

	updateMainMenu(id: string, data: any): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/main-menus`;
		return this.service.updateItem(baseUrl, id, data).pipe(catchError(error => this.handleError('updateMainMenu', error)));
	}

	deleteMainMenu(id: string): Observable<any> {
		const baseUrl = this.shared.RootEndPointAPI + `/main-menus`;
		return this.service.deleteItem(baseUrl, id).pipe(catchError(error => this.handleError('deleteMainMenu', error)));
	}

	handleError(methodName: string, errorData: HttpErrorResponse | any) {
		let errorResponse: any = {
			status: 0,
			message: ''
		};
		return throwError(() => new Error(errorResponse.message));
	}


	//Public
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

}
