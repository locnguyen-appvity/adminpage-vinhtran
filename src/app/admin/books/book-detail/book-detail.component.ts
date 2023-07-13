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
	selector: 'app-book-detail',
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.scss'],
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
export class BookDetailComponent extends SimpleBaseComponent implements OnInit {

	public bookFormGroup: FormGroup;
	public fileSelected: any;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Sách";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public arrBooks: any[] = [];
	public arrCatalogues: any[] = [];

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
			this.getBook();
		}

	}

	ngOnInit(): void {
		this.bookFormGroup = this.fb.group({
			title: "",
			link: "",
			metaDescription: "",
			entityId: "",
			entityType: "",
			photo: "",
			catalogueId: "",
			categoryIds: [],
			tags: [],
			metaKeyword: [],
		});
		this.bookFormGroup.get('title').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
			this.bookFormGroup.get('link').setValue(this.sharedService.getLinkOfName(name));
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
		this.router.navigate(['/admin/books/books-list']);
	}

	getAllData() {
		this.getBooks();
		this.getCatalogues();
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

	getBooks() {
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

	getBook() {
		this.service.getBook(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.localItem._eventDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.eventDate);
					this.bookFormGroup.patchValue({
						title: this.localItem.title,
						link: this.localItem.link,
						metaDescription: this.localItem.metaDescription,
						entityId: this.localItem.entityId,
						entityType: this.localItem.entityType,
						categoryIds: this.localItem.categoryIds,
						catalogueId: this.localItem.catalogueId,
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
		this.router.navigate(['/admin/books/books-list']);
	}

	onSave(status: string) {
		let valueForm = this.bookFormGroup.value;
		let dataJSON = {
			"entityId": valueForm.entityId,
			"entityType": "book",
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			"link": valueForm.link,
			"categoryIds": valueForm.categoryIds,
			"catalogueId": valueForm.catalogueId,
			"tags": valueForm.tags,
			"metaDescription": valueForm.metaDescription,
			"metaTitle": valueForm.link,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
			"status": status,
		}

		// {
		//     "title": "fdadfa",
		//     "photo": "dfsfas",
		//     "link": null,
		//     "categoryIds": [],
		//     "entityId": "3dd1d0e8-b18f-4375-8e60-cea079168217",
		//     "entityType": null,
		//     "catalogueId": null,
		//     "tags": [],
		//     "metaDescription": null,
		//     "metaTitle": null,
		//     "metaKeyword": null,
		//     "visit": null,
		//     "authorIds": [],
		//     "translatorIds": [],
		//     "originalCreators": [],
		//     "publisher": "s",
		//     "publishYear": null,
		//     "status": null,
		//     "created": null,
		//     "modified": null,
		//     "createdBy": null,
		//     "modifiedBy": null,
		//     "id": "3dd1d0e8-b18f-4375-8e60-cea079168217"
		// }
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateBook(this.ID, dataJSON);
		}
		else {
			request = this.service.createBook(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showDetailSnackbar(snackbarData);
				this.router.navigate(['/admin/books/books-list']);
			}
		})
	}

	showDetailSnackbar(dataDetail: any) {
		this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
			duration: 5000,
			data: dataDetail,
			horizontalPosition: 'start'
		});
	}

}
