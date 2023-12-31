import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, take, takeUntil } from 'rxjs';
import { DialogSelectedMediaComponent } from 'src/app/controls/dialog-selected-media/dialog-selected-media.component';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-episode-info',
	templateUrl: './episode-info.component.html',
	styleUrls: ['./episode-info.component.scss'],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppCustomDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: CUSTOM_DATE_FORMATS
		}
	]
})
export class EpisodeInfoComponent extends SimpleBaseComponent implements OnInit, AfterViewInit {

	public episodeFormGroup: FormGroup;
	public fileSelected: any;
	public fileMeidaSelected: any;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Episode";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public arrBooks: any[] = [];

	constructor(
		private service: SharedService,
		public sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public router: Router,
		public snackbar: MatSnackBar,
		public activeRoute: ActivatedRoute,
		public dialog: MatDialog
	) {
		super(sharedService);
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (!this.isNullOrEmpty(this.ID)) {
			this.getEpisode();
		}

	}

	ngAfterViewInit(): void {
		// if (this.subscription[`scheduleSignalR`]) {
		// 	this.subscription[`scheduleSignalR`].unsubscribe();
		// }
		// this.subscription[`scheduleSignalR`] = observableTimer(0, 5000).pipe(takeUntil(this.unsubscribe)).subscribe({
		// 	next: (t) => {
		// 		let htmlElement = document.getElementsByClassName('miniSound__logo');
		// 		if (htmlElement && htmlElement.length > 0) {
		// 			// for(let temf of htmlElement){

		// 			// }
		// 			// htmlElement.style.display = 'none';
		// 			if (this.subscription[`scheduleSignalR`]) {
		// 				this.subscription[`scheduleSignalR`].unsubscribe();
		// 			}
		// 		}
		// 		return t;
		// 	}
		// })
	}

	ngOnInit(): void {
		this.episodeFormGroup = this.fb.group({
			title: "",
			link: "",
			metaDescription: "",
			entityId: "",
			entityType: "",
			_entityId: "",
			content: "",
			photo: "",
			mediaFile: "",
			mediaFileId: "",
			// categoryIds: [],
			tags: [],
			metaKeyword: [],
		});
		this.episodeFormGroup.get('title').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
			this.episodeFormGroup.get('link').setValue(this.sharedService.getLinkOfName(name));
		})
		this.getAllData();
	}

	valueChangesFile(event: any) {
		if (event && event.action == 'value-change') {
			this.fileSelected = event.data ? event.data : "";
		}
	}

	onSelectItem(event: any, target: string) {
		if (target == "entityId") {
			this.episodeFormGroup.get("entityType").setValue(event ? event.entityType : "");
			this.episodeFormGroup.get("entityId").setValue(event ? event.id : "");
		}
	}

	updateLabelTitle(status: string) {
		let statusLabel = {
			title: "Tạo Mới",
			class: 'draft-label'
		}
		switch (status) {
			case 'draft':
				statusLabel.title = "Lưu Nháp";
				statusLabel.class = "pending-label";
				break;
			case 'publish':
				statusLabel.title = "Đã Xuất Bản";
				statusLabel.class = "approved-label";
				break;
			case 'inactive':
				statusLabel.title = "Tạm Ẩn";
				statusLabel.class = "rejected-label";
				break;
		}
		return statusLabel;
	}

	routeToBack() {
		this.router.navigate(['/admin/episodes/episodes-list']);
	}

	getAllData() {
		this.getBooks();
	}

	getBooks() {
		forkJoin({ getBooks: this.service.getBooks(), getChapters: this.service.getChapters() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res) {
					if (res.getBooks.value && res.getBooks.value.length > 0) {
						for (let item of res.getBooks.value) {
							item.groupName = 'Sách';
							item.groupCode = 'book';
							item.entityType = 'book';
							item._id = `book_${item.id}`;
						}
						items.push(...res.getBooks.value);
					}
					if (res.getChapters.value && res.getChapters.value.length > 0) {
						for (let item of res.getChapters.value) {
							item.groupName = 'Chương';
							item.groupCode = 'chapter';
							item.entityType = 'chapter';
							item._id = `chapter_${item.id}`;
						}
						items.push(...res.getChapters.value);
					}
				}
				this.arrBooks = items;
			}
		})
	}

	getEpisode() {
		this.service.getEpisode(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.localItem._eventDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.eventDate);
					this.localItem._entityId = "";
					if (!this.isNullOrEmpty(this.localItem.entityId) && !this.isNullOrEmpty(this.localItem.entityType)) {
						this.localItem._entityId = `${this.localItem.entityType}_${this.localItem.entityId}`
					}
					if (!this.isNullOrEmpty(this.localItem.mediaFileId)) {
						this.getMediaFileId(this.localItem.mediaFileId);
					}
					this.episodeFormGroup.patchValue({
						title: this.localItem.title,
						link: this.localItem.link,
						metaDescription: this.localItem.metaDescription,
						_entityId: this.localItem._entityId,
						entityId: this.localItem.entityId,
						entityType: this.localItem.entityType,
						mediaFileId: this.localItem.mediaFileId,
						// categoryIds: this.localItem.categoryIds,
						metaKeyword: this.localItem._metaKeyword,
						tags: this.localItem.tags,
						photo: this.localItem.photo,
					});
				}
			}
		})
	}

	getMediaFileId(mediaFileId: string) {
		this.service.getMediaFile(mediaFileId).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.episodeFormGroup.get("mediaFile").setValue(res.title);
					this.fileMeidaSelected = res;
				}
			}
		})
	}

	// getCategories() {
	// 	this.arrCategories = [];
	// 	this.service.getCategories().pipe(take(1)).subscribe({
	// 		next: (res: any) => {
	// 			if (res && res.value) {
	// 				this.arrCategories = res.value;
	// 			}
	// 		}
	// 	})
	// }

	// getTags() {
	// 	this.arrTags = [];
	// 	this.service.getTags().pipe(take(1)).subscribe({
	// 		next: (res: any) => {
	// 			if (res && res.value && res.value.length > 0) {
	// 				this.arrTags = res.value;
	// 			}
	// 		}
	// 	})
	// }

	onCancel() {
		this.router.navigate(['/admin/episodes/episodes-list']);
	}

	onSave(status: string) {
		let valueForm = this.episodeFormGroup.value;
		let dataJSON = {
			"entityId":  valueForm.entityId,
			"entityType":  valueForm.entityType,
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			"link": valueForm.link,
			"content": valueForm.content,
			// "categoryIds": valueForm.categoryIds,
			"tags": valueForm.tags,
			"metaDescription": valueForm.metaDescription,
			"metaTitle": valueForm.link,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
			"status": status,
			"mediaFileId": valueForm.mediaFileId,
		}

		// {
		//     "title": "dfasdf",
		//     "photo": "fasdf",
		//     "link": "fdf",
		//     "content": "dfdff",
		//     "categoryIds": [
		//         "3dd1d0e8-b18f-4375-8e60-cea079168217"
		//     ],
		//     "entityType": "dfkj",
		//     "tags": [],
		//     "metaDescription": null,
		//     "metaTitle": null,
		//     "metaKeyword": "",
		//     "visit": null,
		//     "mediaFileId": null,
		//     "status": null,
		//     "created": null,
		//     "modified": null,
		//     "createdBy": null,
		//     "modifiedBy": null,
		//     "id": "3dd1d0e8-b18f-4375-8e60-cea079168217"
		// }
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateEpisode(this.ID, dataJSON);
		}
		else {
			request = this.service.createEpisode(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.router.navigate(['/admin/episodes/episodes-list']);
			}
		})
	}

	showInfoSnackbar(dataInfo: any) {
		this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
			duration: 5000,
			data: dataInfo,
			horizontalPosition: 'start'
		});
	}

	clearValue(controlName: string) {
		this.episodeFormGroup.get(controlName).setValue("");
	}

	onSelectMeida() {
		let config: any = {
			data: {
				target: 'single'
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-xxl';
		config.maxWidth = '90vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(DialogSelectedMediaComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res && res.action == 'save') {
					this.fileMeidaSelected = res.data ? res.data[0] : null;
					this.episodeFormGroup.get("mediaFile").setValue(this.fileMeidaSelected ? this.fileMeidaSelected.title : "");
					this.episodeFormGroup.get("mediaFileId").setValue(this.fileMeidaSelected ? this.fileMeidaSelected.id : "");
				}
			}
		})
	}

}

