import { Component, Input, Output, EventEmitter, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LinqService } from 'src/app/shared/linq.service';
import { dragMeta } from 'angular-file/file-upload/ngf.directive';
import { FormControl } from '@angular/forms';
import { GlobalSettings } from 'src/app/shared/global.settings';
@Component({
	selector: 'se-itinerary-imgs',
	styleUrls: ['./itinerary-imgs.component.scss'],
	templateUrl: './itinerary-imgs.component.html'
})
export class ItineraryIMGsComponent extends SimpleBaseComponent implements OnChanges {
	@Input() id: string = '';
	@Output() valueChanges: any = new EventEmitter();
	@Output() uploading: any = new EventEmitter();
	@Input() canEdit: boolean = true;
	@Input() canUploadFile: boolean = true;
	@Input() data: any[] = [];
	@Input() datatItem: any;
	@Input() type: string = "member";
	@Input() guid: string = "member-file-upload";
	@Input() acceptFiles: string = "*";
	@Input() typeShowIMG: string = 'grid';
	@Input() originalFileName: string = '';
	@Input() hasGetData: boolean = true;
	//get slected file
	@Input() showPaginator: boolean = true;
	@Input() entityID: string = '';
	@Input() entityType: string = '';
	@Input() mode: string = 'upload-runtime';
	@Input() target: string = 'multi';
	public noFilesUploads: boolean = true;
	public files: File[] = [];
	public validComboDrag: boolean = false;
	public dragFiles: dragMeta[] = [];
	public dataSources: any = [];
	public editableFiles: boolean = true;
	public downloadable: boolean = true;
	public uploadingFile: boolean = false;
	public title: string = 'Tải lên hình ảnh';
	// public styles: any = {
	// 	0: null
	// };
	public loadingFile: boolean = false;
	public total: number = 0;
	public skip: number = 0;
	public currentPageIndex: number = 0;
	public pageSize: number = 4;
	public pageSizeOptions: any[] = [4, 8, 12];
	public txtSearch: FormControl;
	public searchValue: string = "";

	constructor(public sharedService: SharedPropertyService,
		public renderer: Renderer2,
		private service: SharedService,
		public linq: LinqService,
		public router: Router) {
		super(sharedService);
		this.getAllFiles();
		this.txtSearch = new FormControl("");
		this.txtSearch.valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), takeUntil(this.unsubscribe)).subscribe({
			next: (value: any) => {
				if (this.sharedService.isChangedValue(this.searchValue, value)) {
					this.doQuickSearch(value);
				}
			}
		});
	}

	clearSearch() {
		this.txtSearch.setValue("");
	}

	doQuickSearch(searchValue: string) {
		this.searchValue = searchValue;
		this.dataSources = [];
		this.getFiles();
	}

	getFiles() {
		if (!this.isNullOrEmpty(this.id) && this.id != 'mydisk') {
			this.getEntityFileListForEntity();
		}
		else {
			this.getAllFiles();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['data']) {
			this.dataSources = this.data;
			if (this.data.length > 0) {
				this.noFilesUploads = false;
			}
		}
		if (changes['id']) {
			this.dataSources = [];
			this.getFiles();
		}
		if (changes['canEdit']) {
			this.editableFiles = this.canEdit;
		}
		if (changes['typeShowIMG']) {
			this.currentPageIndex = 0;
			this.skip = 0;
		}
	}

	getAllFiles() {
		this.dataProcessing = true;
		let options = {
			filter: this.getFilter()
		}
		this.loadingFile = true;
		this.service.getFiles(options).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.imageUrl = item.fileUrl;
					}
					this.noFilesUploads = false;
				}
				else {
					this.noFilesUploads = true;
				}
				this.dataSources = items;
				this.loadingFile = false;
				this.dataProcessing = false;
			}, error: error => {
				this.dataProcessing = false;
			}
		})
	}

	getEntityFileListForEntity() {
		this.dataProcessing = true;
		let options = {
			filter: this.getFilter()
		}
		this.loadingFile = true;
		this.service.getFolderFiles(this.id, options).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.imageUrl = item.fileUrl;
					}
					this.noFilesUploads = false;
				}
				else {
					this.noFilesUploads = true;
				}
				this.dataSources = items;
				this.loadingFile = false;
				this.dataProcessing = false;
			}, error: error => {
				this.dataProcessing = false;
			}
		})
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(name), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}

	uploadFiles() {
		if (this.dataProcessing || !this.editableFiles) {
			return;
		}
		if (!this.isNullOrEmpty(this.id) && this.mode == "upload-runtime") {
			if (this.files.length > 0) {
				this.uploadingFile = true;
				this.uploaMultiFiles(this.files).pipe(takeUntil(this.unsubscribe)).subscribe({
					next: () => {
						this.uploadingFile = false;
						this.files = [];
						this.getFiles();
					}
				});
			}
		} else {
			this.handleBase64ToFiles(this.files).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (results: any) => {
					this.dataSources = results;
				}
			})
		}
		if (this.files.length > 0) {
			this.noFilesUploads = false;
		} else {
			this.noFilesUploads = true;
		}
	}

	uploaMultiFiles(files: any) {
		return new Observable(obs => {
			if (files && files.length > 0) {
				let sub = new BehaviorSubject(0);
				sub.subscribe({
					next: (index: number) => {
						if (index < files.length) {
							if (files[index]) {
								// let file = files[index];
								// let formData = new FormData();
								// formData.append('file', file, this.originalFileName ? `${this.originalFileName}-${file.name}` : file.name);
								// formData.append('fileName', file.name);
								// formData.append('entityID', this.id);
								// formData.append('entityType', this.type);
								// formData.append('Content-Type', 'multipart/form-data');
								// if (!this.isNullOrEmpty(this.styles[index])) {
								// 	formData.append('styles', JSON.stringify(this.styles[index]));
								// }
								this.convertFile(files[index]).pipe(takeUntil(this.unsubscribe)).subscribe({
									next: (res: any) => {
										let dataJSON = {
											name: res.name,
											binaryData: res.imageUrl,
											folderId: this.id != 'mydisk' ? this.id : "",
											ext: res.type
										}
										this.service.createFile(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
											next: () => {
												index++;
												sub.next(index);
											},
											error: error => {
												console.log(error);
												index++;
												sub.next(index);
											}
										});
									},
									error: error => {
										console.log(error);
										index++;
										sub.next(index);
									}
								});

							}
							else {
								index++;
								sub.next(index);
							}
						}
						else {
							sub.complete();
							sub.unsubscribe();
							obs.next();
							obs.complete();
						}

					}
				});
			}
			else {
				obs.next([]);
				obs.complete();
			}
		})
	}


	// emitFileSelect(files: any) {
	// 	let index = 0;
	// 	let formData = [];
	// 	if (files.length > 0) {
	// 		for (let file of files) {
	// 			formData.push({
	// 				styles: null,
	// 				file: file,
	// 				type: 'entityfiles',
	// 				fileID: file.fileID
	// 			});
	// 			index++;
	// 		}
	// 	}
	// 	this.valueChanges.emit(formData);
	// }

	handleBase64ToFiles(files: any) {
		return new Observable(obs => {
			if (files && files.length > 0) {
				let results = [];
				let sub = new BehaviorSubject(0);
				sub.subscribe({
					next: (index: number) => {
						if (index < files.length) {
							if (files[index]) {
								this.convertFile(files[index]).pipe(takeUntil(this.unsubscribe)).subscribe({
									next: (res: any) => {
										results.push(res)
										index++;
										sub.next(index);
									},
									error: error => {
										console.log(error);
										index++;
										sub.next(index);
									}
								});
							}
							else {
								index++;
								sub.next(index);
							}
						}
						else {
							sub.complete();
							sub.unsubscribe();
							obs.next(results);
							obs.complete();
						}

					}
				});
				// let index = 0;
				// for (let file of files) {
				// 	if (this.isNullOrEmpty(this.styles[index])) {
				// 		this.styles[index] = {
				// 			transform: 0
				// 		};
				// 	}
				// 	index++;
				// 	requests.push(this.convertFile(file));
				// }
			}
			// if (requests.length > 0) {
			// 	forkJoin(requests).pipe(takeUntil(this.unsubscribe)).subscribe({
			// 		next: (results: any) => {
			// 			obs.next(results);
			// 			obs.complete();
			// 		}
			// 	})
			// }
			else {
				obs.next([]);
				obs.complete();
			}
		})
	}



	convertFile(file: File): Observable<any> {
		return new Observable(obs => {
			let reader = new FileReader();
			reader.onload = (event: any) => {
				let type = file.type ? file.type.split('/') : [''];
				obs.next({
					id: null,
					name: file.name,
					imageUrl: event.target.result,
					type: type[1] ? type[1] : type[0]
				});
				obs.complete();
			}
			reader.onloadend = (evt: any) => {
				if (evt.target.readyState == FileReader.DONE) {
					reader.abort();
				}
			};
			reader.readAsDataURL(file);
		})
	}

	removeFile(file, index) {
		if (this.dataProcessing || !this.editableFiles) {
			return;
		}
		if (!this.isNullOrEmpty(file.id)) {
			this.dataProcessing = true;
			this.service.deleteFile(file.id).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: () => {
					this.dataProcessing = false;
					this.getFiles();
				}, error: error => {
					this.getFiles();
					this.files = [];
				}
			})
		} else {
			this.files.splice(index, 1);
			this.handleBase64ToFiles(this.files).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (results: any) => {
					this.dataSources = results;
				}
			})
			if (this.files.length === 0) {
				this.noFilesUploads = true;
			}
		}
	}

	dowloadFile(file: any) {
		if (this.isNullOrEmpty(file.urlPatch)) {

		}
		else {
			const blob = this.b64toBlob(file.urlPatch, file.mimetype);
			const objectUrl = URL.createObjectURL(blob);
			this.readyToDowload(objectUrl, file);
		}
	}

	b64toBlob(b64Data, contentType: string, sliceSize = 512) {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}

	readyToDowload(url: any, file: any) {
		let anchor = this.renderer.createElement('a');
		this.renderer.setStyle(anchor, 'visibility', 'hidden');
		this.renderer.setAttribute(anchor, 'href', url);
		this.renderer.setAttribute(anchor, 'target', '_blank');
		this.renderer.setAttribute(anchor, 'download', file.name);
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	}

	selectedItem(dataItem: any) {
		if (!dataItem.checked && this.target == 'single') {
			this.unCheckAll();
		}
		dataItem.checked = !dataItem.checked;
		this.valueChanges.emit({ action: 'value-change', data: this.dataSources.filter(it => it.checked) });
		// this.checkSingleItem(dataItem);
	}

	unCheckAll() {
		if (this.dataSources && this.dataSources.length > 0) {
			this.dataSources.map(it => it.checked = false);
		}
	}
}

