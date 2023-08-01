import { Component, Input, Output, EventEmitter, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-itinerary-files',
	styleUrls: ['./itinerary-files.component.scss'],
	templateUrl: './itinerary-files.component.html'
})
export class ItineraryFilesComponent extends SimpleBaseComponent implements OnChanges {
	@Output() uploadFile: any = new EventEmitter();
	@Output() uploading: any = new EventEmitter();
	@Input() canEdit: boolean = true;
	@Input() data: any[] = [];
	@Input() entityID: any;
	@Input() entityType: string = "";
	public noFilesUploads: boolean = true;
	public files: File[] = [];
	public validComboDrag: boolean = false;
	public dataSources: any[] = [];
	public editableFiles: boolean = true;
	public downloadable: boolean = true;
	public uploadingFile: boolean = false;
	@Input() title: string = 'Itinerary Files';

	constructor(public sharedService: SharedPropertyService,
		public renderer: Renderer2,
		public router: Router,
		private service: SharedService) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType']) {
			this.getEntityFiles();
		}
	}

	// {
	// 	"name": "fassdfasdf",
	// 	"binaryData": "dsafasdfa",
	// 	"ext": "dfdf",
	// 	"entityID": "d889cfa5-ff1b-44b4-aeb2-2c6ced44799d",
	// 	"entityType": "dfdfd",
	// 	"created": null,
	// 	"createdBy": null,
	// 	"id": "d889cfa5-ff1b-44b4-aeb2-2c6ced44799d"
	// }

	getEntityFiles() {
		let filter = '';
		if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityID)) {
			filter = `entityID eq ${this.entityID} and entityType eq '${this.entityType}'`;
		}
		let options = {
			filter: filter,
			select: 'id,name,ext'
		}
		this.uploadingFile = true;
		this.dataSources = [];
		this.service.getEntityFiles(options).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				this.uploadingFile = false;
				if (res && res.value  && res.value.length > 0) {
					this.noFilesUploads = false;
					this.dataSources = res.value;
				}
				else {
					this.noFilesUploads = true;
				}
			}
		});
	}

	convertFile(file: File): Observable<any> {
		return new Observable(obs => {
			let reader = new FileReader();
			reader.onload = (event: any) => {
				let type = file.type ? file.type.split('/') : [''];
				obs.next({
					id: null,
					name: file.name,
					binaryData: event.target.result,
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


	uploaMultiFiles(files: any) {
		return new Observable(obs => {
			if (files && files.length > 0) {
				let sub = new BehaviorSubject(0);
				sub.subscribe({
					next: (index: number) => {
						if (index < files.length) {
							if (files[index]) {
								this.convertFile(files[index]).pipe(takeUntil(this.unsubscribe)).subscribe({
									next: (res: any) => {
										let dataJSON = {
											name: res.name,
											binaryData: res.binaryData,
											entityID: this.entityID,
											entityType: this.entityType,
											ext: res.type
										}
										this.service.createEntityFile(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
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

	uploadFiles() {
		if (this.dataProcessing || !this.editableFiles || this.isNullOrEmpty(this.entityID) || this.isNullOrEmpty(this.entityType)) {
			return;
		}
		if (this.files.length > 0) {
			this.uploadingFile = true;
			this.uploaMultiFiles(this.files).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: () => {
					this.uploadingFile = false;
					this.files = [];
					this.getEntityFiles();
				}
			});
		}
	}

	removeFile(file) {
		if (this.dataProcessing || !this.editableFiles || this.isNullOrEmpty(file.id)) {
			return;
		}
		if (!this.isNullOrEmpty(file.id)) {
			this.dataProcessing = true;
			this.service.deleteEntityFile(file.id).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: () => {
					this.dataProcessing = false;
					this.files = [];
					this.getEntityFiles();
				}, error: error => {
					this.getEntityFiles();
				}
			})
		} 
	}

	dowloadFile(file: any) {
		if (!this.isNullOrEmpty(file.id)) {
			this.service.getEntityFile(file.id).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (res: any) => {
					if (!this.isNullOrEmpty(res.binaryData)) {
						const blob = this.b64toBlob(res.binaryData, file.ext);
						const objectUrl = URL.createObjectURL(blob);
						this.readyToDowload(objectUrl, file);
					}
				}, error: error => {

				}
			})
		}
		// else {
		// 	const blob = this.b64toBlob(file.urlPatch, file.mimetype);
		// 	const objectUrl = URL.createObjectURL(blob);
		// 	this.readyToDowload(objectUrl, file);
		// }
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
}

