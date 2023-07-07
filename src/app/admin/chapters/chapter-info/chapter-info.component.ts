import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-chapter-info',
	templateUrl: './chapter-info.component.html',
	styleUrls: ['./chapter-info.component.scss'],
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
export class ChapterInfoComponent extends SimpleBaseComponent implements OnInit {

	public chapterFormGroup: FormGroup;
	public fileSelected: any;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Bài Viết";
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
			this.getChapter();
		}

	}

	ngOnInit(): void {
		this.chapterFormGroup = this.fb.group({
			title: "",
			link: "",
			metaDescription: "",
			entityId: "",
			entityType: "",
			photo: "",
			categoryIds: [],
			tags: [],
			metaKeyword: [],
		});
		this.chapterFormGroup.get('title').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
			this.chapterFormGroup.get('link').setValue(this.sharedService.getLinkOfName(name));
		})
		this.getAllData();
	}

	valueChangesFile(event: any) {
		if (event && event.action == 'value-change') {
			this.fileSelected = event.data ? event.data : "";
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
		this.router.navigate(['/admin/chapters/chapters-list']);
	}

	getAllData() {
		this.getBooks();
	}

	getBooks(){
		this.service.getBooks().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.arrBooks = items;
			}
		})
	}

	getChapter() {
		this.service.getChapter(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.localItem._eventDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.eventDate);
					this.chapterFormGroup.patchValue({
						title: this.localItem.title,
						link: this.localItem.link,
						metaDescription: this.localItem.metaDescription,
						entityId: this.localItem.entityId,
						entityType: this.localItem.entityType,
						categoryIds: this.localItem.categoryIds,
						metaKeyword: this.localItem._metaKeyword,
						tags: this.localItem.tags,
						photo: this.localItem.photo,
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

	onCancel() {
		this.router.navigate(['/admin/chapters/chapters-list']);
	}

	onSave(status: string) {
		let valueForm = this.chapterFormGroup.value;
		let dataJSON = {
			"entityId": valueForm.entityId,
			"entityType": "book",
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			"link": valueForm.link,
			"categoryIds": valueForm.categoryIds,
			"tags": valueForm.tags,
			"metaDescription": valueForm.metaDescription,
			"metaTitle": valueForm.link,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
			"status": status,
		}
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateChapter(this.ID, dataJSON);
		}
		else {
			request = this.service.createChapter(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.router.navigate(['/admin/chapters/chapters-list']);
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
