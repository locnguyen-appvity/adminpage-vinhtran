import { Component, Input, Output, EventEmitter, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { CommonUtility } from 'src/app/shared/common.utility';
import { DialogConfirmComponent } from '../confirm';
import { MatDialog } from '@angular/material/dialog';

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
	@Input() mode: string = "";
	public noFilesUploads: boolean = false;
	public files: File[] = [];
	public validComboDrag: boolean = false;
	public dataSources: any[] = [];
	public editableFiles: boolean = true;
	public downloadable: boolean = true;
	public uploadingFile: boolean = false;
	@Input() title: string = 'Itinerary Files';

	public dataFiles: any[] = [];
	public dataFolders: any[] = [];
	// public dataFoldersCache: any[] = [];

	public foldersSelect: any = [];
	public folderSelect: any;

	constructor(public sharedService: SharedPropertyService,
		public renderer: Renderer2,
		public router: Router,
		public dialog: MatDialog,
		private service: SharedService) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType']) {
			this.dataSources = [];
			this.uploadingFile = true;
			forkJoin({ files: this.getEntityFiles(""), folders: this.getEntityFolders("") }).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: () => {
					this.uploadingFile = false;
					this.handleData();
				}
			})
		}
	}

	onReload() {
		forkJoin({ files: this.getEntityFiles(this.folderSelect ? this.folderSelect.id : ""), folders: this.getEntityFolders(this.folderSelect ? this.folderSelect.id : "") }).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: () => {
				this.uploadingFile = false;
				this.handleData();
			}
		})
	}

	handleData() {
		this.dataSources = [];
		let noFilesUploads = true;
		if (this.dataFiles && this.dataFiles.length > 0) {
			noFilesUploads = false;
			this.dataSources.push(...this.dataFiles);
		}
		if (this.dataFolders && this.dataFolders.length > 0) {
			noFilesUploads = false;
			this.dataSources.unshift(...this.dataFolders);
		}
		this.noFilesUploads = noFilesUploads;
	}

	onSelectFolder(folder: any, index: number) {
		if (this.isNullOrEmpty(folder)) {
			if (this.isNullOrEmpty(this.folderSelect)) {
				return;
			}
			this.folderSelect = null;
			this.foldersSelect = []
		}
		else {
			if (this.folderSelect.id == folder.id) {
				return;
			}
			this.folderSelect = folder;
			this.foldersSelect = this.foldersSelect.splice(0, index + 1);
		}
		this.dataSources = [];
		this.uploadingFile = true;
		forkJoin({ files: this.getEntityFiles(folder ? folder.id : ""), folders: this.getEntityFolders(folder ? folder.id : "") }).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: () => {
				this.uploadingFile = false;
				this.handleData();
			}
		})
	}

	onOpenFolder(folder: any) {
		this.foldersSelect.push(folder);
		this.folderSelect = folder;

		this.dataSources = [];
		this.uploadingFile = true;
		forkJoin({ files: this.getEntityFiles(folder.id), folders: this.getEntityFolders(folder.id) }).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: () => {
				this.uploadingFile = false;
				this.handleData();
			}
		})
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

	getEntityFiles(folderID: string) {
		return new Observable(obs => {
			let filter = '';
			if (!this.isNullOrEmpty(folderID)) {
				filter = `entityID eq ${folderID} and entityType eq 'folder'`;
			}
			else {
				if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityID)) {
					filter = `entityID eq ${this.entityID} and entityType eq '${this.entityType}'`;
				}
			}
			let options = {
				filter: filter,
				select: 'id,name,ext'
			}
			this.dataFiles = [];
			this.service.getEntityFiles(options).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						for (let item of res.value) {
							item._type = "file";
							item.icon = CommonUtility.getFileIcon(item.name);
						}
						items = res.value;
					}
					this.dataFiles = items;
					obs.next();
					obs.complete();
				}
			});
		})
	}

	// getEntityFilesFolder(folderID: string) {
	// 	return new Observable(obs => {
	// 		let filter = '';

	// 		let options = {
	// 			filter: filter,
	// 			select: 'id,name,ext'
	// 		}
	// 		this.uploadingFile = true;
	// 		this.service.getEntityFiles(options).pipe(takeUntil(this.unsubscribe)).subscribe({
	// 			next: (res: any) => {
	// 				this.uploadingFile = false;
	// 				let items = [];
	// 				if (res && res.value && res.value.length > 0) {
	// 					for (let item of res.value) {
	// 						item._type = "file";
	// 						item.icon = CommonUtility.getFileIcon(item.name);
	// 					}
	// 					items = res.value;
	// 				}
	// 				this.dataFiles = items;
	// 				obs.next();
	// 				obs.complete();
	// 			}
	// 		});
	// 	})
	// }

	onEditFolder(folder) {
		let config: any = {
			data: {
				submitBtn: 'Lưu',
				cancelBtn: 'Hủy',
				valueType: 'text',
				requireCtrl: true,
				header: "Sửa Thư Mục",
				lableCtrl: 'Tên Thư Mục',
				colorSubmit: "primary",
				value: folder.name
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = false;
		let dialogRef = this.dialog.open(DialogConfirmComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res && res.action == "ok") {
					let parent = null;
					if (!this.isNullOrEmpty(this.folderSelect) && this.folderSelect.id) {
						parent = this.folderSelect.id
					}
					let dataJSON = {
						"name": res.data
					}
					this.service.updateEntityFolder(folder.id, dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
						next: () => {
							this.getEntityFolders(parent).pipe(takeUntil(this.unsubscribe)).subscribe({
								next: () => {
									this.uploadingFile = false;
									this.handleData();
								}
							})
						}
					});
				}
			}
		});
	}

	onAddItemForNote() {
		let config: any = {
			data: {
				submitBtn: 'Lưu',
				cancelBtn: 'Hủy',
				valueType: 'text',
				requireCtrl: true,
				header: "Thêm Thư Mục",
				lableCtrl: 'Tên Thư Mục',
				colorSubmit: "primary"
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = false;
		let dialogRef = this.dialog.open(DialogConfirmComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res && res.action == "ok") {
					let parent = null;
					if (!this.isNullOrEmpty(this.folderSelect) && this.folderSelect.id) {
						parent = this.folderSelect.id
					}
					let dataJSON = {
						"parent": parent,
						"name": res.data,
						"entityID": this.entityID,
						"entityType": this.entityType
					}
					this.service.createEntityFolder(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
						next: () => {
							this.getEntityFolders(parent).pipe(takeUntil(this.unsubscribe)).subscribe({
								next: () => {
									this.uploadingFile = false;
									this.handleData();
								}
							})
						}
					});
				}
			}
		});
	}

	getEntityFolders(folderID: string) {
		return new Observable(obs => {
			let filter = '';
			if (this.isNullOrEmpty(folderID)) {
				if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityID)) {
					filter = `entityID eq ${this.entityID} and entityType eq '${this.entityType}' and parent eq null`;
				}
			}
			else {
				filter = `parent eq ${folderID}`;
			}
			let options = {
				filter: filter,
				// select: 'id,name,ext'
			}
			this.dataFolders = [];
			this.service.getEntityFolders(options).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						items = res.value;
						for (let item of items) {
							item.icon = 'ic_folder';
							item._type = 'folder'
						}
					}
					this.dataFolders = items;
					obs.next();
					obs.complete();
				}
			});
		})
	}


	buildTree(items, parent = null) {
		const tree = [];
		items.forEach((item: any) => {
			if (item.parent === parent) {
				const children = this.buildTree(items, item.id);
				tree.push({
					id: item.id,
					children: children,
					name: item.name,
					type: '',
					link: '',
					parent: item.parent
				});
			}
		});

		return tree;
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
										let entityID = this.entityID;
										let entityType = this.entityType;
										if (!this.isNullOrEmpty(this.folderSelect) && !this.isNullOrEmpty(this.folderSelect.id)) {
											entityID = this.folderSelect.id;
											entityType = 'folder';
										}
										let dataJSON = {
											name: res.name,
											binaryData: res.binaryData,
											entityID: entityID,
											entityType: entityType,
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
					this.uploadingFile = true;
					this.dataSources = [];
					this.getEntityFiles(this.folderSelect ? this.folderSelect.id : "").pipe(takeUntil(this.unsubscribe)).subscribe({
						next: () => {
							this.uploadingFile = false;
							this.handleData();
						}
					});
				}
			});
		}
	}

	removeFile(file) {
		if (this.dataProcessing || !this.editableFiles || this.isNullOrEmpty(file.id)) {
			return;
		}
		if (!this.isNullOrEmpty(file.id)) {
			let config: any = {
				data: {
					submitBtn: 'Xác nhận',
					cancelBtn: 'Hủy',
					confirmMessage: `Bạn có chắc chắn muốn xóa tệp <strong>${file.name}</strong>?`
				}
			};
			this.showDialogConfirm(config).pipe(take(1)).subscribe({
				next: (resConfirm: any) => {
					if (resConfirm && resConfirm.action == 'ok') {
						this.dataProcessing = true;
						this.service.deleteEntityFile(file.id).pipe(takeUntil(this.unsubscribe)).subscribe({
							next: () => {
								this.dataProcessing = false;
								this.files = [];
								this.uploadingFile = true;
								this.dataSources = [];
								this.getEntityFiles(this.folderSelect ? this.folderSelect.id : "").pipe(takeUntil(this.unsubscribe)).subscribe({
									next: () => {
										this.uploadingFile = false;
										this.handleData();
									}
								});
							}, error: error => {
								this.uploadingFile = true;
								this.dataSources = [];
								this.getEntityFiles(this.folderSelect ? this.folderSelect.id : "").pipe(takeUntil(this.unsubscribe)).subscribe({
									next: () => {
										this.uploadingFile = false;
										this.handleData();
									}
								});
							}
						})
					}
				}
			})

		}
	}

	removeFolder(folder) {
		if (this.dataProcessing || !this.editableFiles || this.isNullOrEmpty(folder.id)) {
			return;
		}
		if (!this.isNullOrEmpty(folder.id)) {
			let config: any = {
				data: {
					submitBtn: 'Xác nhận',
					cancelBtn: 'Hủy',
					confirmMessage: `Nếu xóa thư mục <strong>${folder.name}</strong> đồng nghĩa bạn sẽ <strong>xóa những thư mục nằm trong và những files thuộc thư mục này</strong>. Bạn có chắc chắn xóa?`
				}
			};
			this.showDialogConfirm(config).pipe(take(1)).subscribe({
				next: (resConfirm: any) => {
					if (resConfirm && resConfirm.action == 'ok') {
						this.dataProcessing = true;
						this.service.deleteEntityFolder(folder.id).pipe(takeUntil(this.unsubscribe)).subscribe({
							next: () => {
								this.dataProcessing = false;
								this.files = [];
								this.uploadingFile = true;
								this.dataSources = [];
								this.getEntityFolders(this.folderSelect ? this.folderSelect.id : "").pipe(takeUntil(this.unsubscribe)).subscribe({
									next: () => {
										this.uploadingFile = false;
										this.handleData();
									}
								});
							}, error: error => {
								this.uploadingFile = true;
								this.dataSources = [];
								this.getEntityFolders(this.folderSelect ? this.folderSelect.id : "").pipe(takeUntil(this.unsubscribe)).subscribe({
									next: () => {
										this.uploadingFile = false;
										this.handleData();
									}
								});
							}
						})
					}
				}
			})

		}
	}

	showDialogConfirm(config: any) {
		return new Observable(obs => {
			config.disableClose = true;
			config.panelClass = 'dialog-form-l';
			config.maxWidth = '80vw';
			config.autoFocus = false;
			let dialogRef = this.dialog.open(DialogConfirmComponent, config);
			dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (res: any) => {
					obs.next(res);
					obs.complete();
				}
			});
		})
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
		const b64Datas = b64Data.split(',');
		const byteCharacters = atob(b64Datas[1]);
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

