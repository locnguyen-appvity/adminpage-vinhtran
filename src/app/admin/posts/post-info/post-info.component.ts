import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import { JoditAngularComponent } from 'jodit-angular';
import { Observable, of, take, takeUntil } from 'rxjs';
// import { DialogSelectedImgsComponent } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.component';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-post-info',
	templateUrl: './post-info.component.html',
	styleUrls: ['./post-info.component.scss'],
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
export class PostInfoComponent extends SimpleBaseComponent implements OnInit {

	// public editorJodit: JoditAngularComponent;
	// @ViewChild('editorJodit') set elemOnHTML(elemOnHTML: JoditAngularComponent) {
	// 	if (!!elemOnHTML) {
	// 		this.editorJodit = elemOnHTML;
	// 	}
	// }

	public postFormGroup: FormGroup;
	// public arrCategories: any[] = [];
	public arrSlides: any[] = [];
	public arrLocations$: Observable<any>;
	public arrAuthors$: Observable<any>;
	public arrCatalogues: any[] = [];
	public fileSelected: any;
	public fileSelectedHotNew: any;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Bài Viết";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}

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
		this.arrAuthors$ = new Observable();
		if (!this.isNullOrEmpty(this.ID)) {
			this.getPost();
		}

	}

	ngOnInit(): void {
		this.postFormGroup = this.fb.group({
			title: "",
			link: "",
			metaDescription: "",
			content: "",
			slideId: "",
			catalogueId: "",
			categoryIds: [],
			eventDate: this.sharedService.moment(),
			eventTime: "",
			locationId: '',
			locationType: '',
			authorId: '',
			hotNewsPhoto: '',
			photo: '',
			isEvent: 'len_lich',
			tags: [],
			metaKeyword: [],
			hotNew: false,
			hasEvent: false
		});
		this.postFormGroup.get('title').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
			this.postFormGroup.get('link').setValue(this.sharedService.getLinkOfName(name));
		})
		this.getAllData();
	}

	// actionsAsync() {
	// 	this.sharedService.dataItemObs.pipe(distinctUntilChanged(), share(), shareReplay({
	// 		bufferSize: 1,
	// 		refCount: true,
	// 	}), takeUntil(this.unsubscribe)).subscribe((res: any) => {
	// 		if (res.action === 'open-dialog-img') {
	// 			this.openDialogImg();
	// 		}
	// 	})
	// }

	openDialogImg(editor?: any) {
		// let config: any = {
		// 	data: {
		// 		entityID: "",
		// 		entityType: "",
		// 		hasGetData: false
		// 	}
		// };
		// config.disableClose = false;
		// config.panelClass = 'dialog-form-xxl';
		// config.maxWidth = '90vw';
		// config.autoFocus = true;
		// let dialogRef = this.dialog.open(DialogSelectedImgsComponent, config);
		// dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
		// 	next: (res: any) => {

		// 	}
		// })
	}

	valueChangesFile(event: any, target: string) {
		if (event && event.action == 'value-change') {
			if (target == 'post') {
				this.fileSelected = event.data ? event.data : "";
			}
			else if (target == 'hotNew') {
				this.fileSelectedHotNew = event.data ? event.data : "";
			}
		}
		else if (event && event.action == 'clear') {
			if (target == 'post') {
				this.postFormGroup.get('photo').setValue("");
				this.fileSelected = "";
			}
			else if (target == 'hotNew') {
				this.postFormGroup.get('hotNewsPhoto').setValue("");
				this.fileSelected = "";
			}

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
			case 'active':
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
		this.router.navigate(['/admin/posts/post-list']);
	}

	getAllData() {
		// this.getCategories();
		// this.getTags();
		this.getAuthors();
		this.getSlides();
		this.getOrganizations();
		this.getCatalogues();
	}

	// valueChangeChip(event: any, target: string) {
	// 	if (event.action == 'change-value') {
	// 		if(target == 'categories'){

	// 		}
	// 		this.tagsSelect = event.data;
	// 	}
	// }

	getPost() {
		this.service.getPost(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.localItem._eventDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.eventDate);
					this.localItem.eventTime = this.localItem._eventDate ? this.localItem._eventDate.format("HH:mm") : "00:00";
					this.postFormGroup.patchValue({
						title: this.localItem.title,
						link: this.localItem.link,
						metaDescription: this.localItem.metaDescription,
						content: this.localItem.content,
						slideId: this.localItem.slideId,
						categoryIds: this.localItem.categoryIds,
						metaKeyword: this.localItem._metaKeyword,
						eventDate: this.localItem._eventDate,
						authorId: this.localItem.authorId,
						locationId: this.localItem.locationId,
						locationType: "organization",
						tags: this.localItem.tags,
						catalogueId: this.localItem.catalogueId,
						eventTime: this.localItem.eventTime,
						isEvent: this.localItem.isEvent ? this.localItem.isEvent : 'len_lich',
						hasEvent: this.localItem.isEvent ? true : false,
						photo: this.localItem.photo,
						hotNewsPhoto: this.localItem.hotNewsPhoto,
					});
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

	getAuthors() {
		this.service.getAuthors().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.arrAuthors$ = of(items);
			}
		})
	}

	getSlides() {
		let options = {
			select: 'id,name',
			filter: "status eq 'publish'"
		}
		this.arrSlides = [];
		this.service.getSlides(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.arrSlides = items;
			}
		})
	}

	getCatalogues() {
		let options = {
			select: 'id,name'
		}
		this.arrCatalogues = [];
		this.service.getCatalogues(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.arrCatalogues = items;
			}
		})
	}

	getOrganizations() {
		this.service.getOrganizations().pipe(take(1)).subscribe((res: any) => {
			let items = [];
			if (res && res.value && res.value.length > 0) {
				items = res.value;
				for (let item of items) {
					switch (item.type) {
						case 'giao_xu':
							item.title = `Giáo xứ ${item.name}`;
							break;
						case 'dong_tu':
							item.title = `Dòng ${item.name}`;
							break;
						case 'cong_doan':
							item.title = `Cộng Đoàn ${item.name}`;
							break;
						default:
							item.title = item.name;
							break;
					}
				}
			}
			this.arrLocations$ = of(items);

		})
	}

	onCancel() {
		this.router.navigate(['/admin/posts/post-list']);
	}

	onSave(status: string) {
		let valueForm = this.postFormGroup.value;
		if (valueForm.eventDate && valueForm.eventTime) {
			let timeValue = valueForm.eventTime.split(':');
			valueForm.eventDate.set({ 'hour': timeValue[0] ? timeValue[0] : 0, 'minute': timeValue[1] ? timeValue[1] : 0 });
		}
		let eventDate = this.sharedService.ISODay(valueForm.eventDate);
		let dataJSON = {
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			"hotNewsPhoto": this.fileSelectedHotNew ? this.fileSelectedHotNew.filePath : valueForm.hotNewsPhoto,
			"link": valueForm.link,
			"authorId": valueForm.authorId,
			"locationId": valueForm.locationId,
			"catalogueId": valueForm.catalogueId,
			"content": valueForm.content,
			"slideId": this.sharedService.checkItemExistsInArray(valueForm.slideId, this.arrSlides) ? valueForm.slideId : null,
			"categoryIds": valueForm.categoryIds,
			"tags": valueForm.tags,
			"metaDescription": valueForm.metaDescription,
			"isEvent": valueForm.hasEvent ? valueForm.isEvent : "",
			"metaTitle": valueForm.link,
			"topLevel": null,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
			"status": status,
			"eventDate": eventDate ? eventDate : null
		}
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updatePost(this.ID, dataJSON);
		}
		else {
			request = this.service.createPost(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.router.navigate(['/admin/posts/post-list']);
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

}
