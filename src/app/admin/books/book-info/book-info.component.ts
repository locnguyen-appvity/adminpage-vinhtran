import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-book-info',
	templateUrl: './book-info.component.html',
	styleUrls: ['./book-info.component.scss'],
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
export class BookInfoComponent extends SimpleBaseComponent implements OnInit {

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
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
        public dialogRef: MatDialogRef<BookInfoComponent>,
		private service: SharedService,
		public sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public router: Router,
		public snackbar: MatSnackBar,
		public activeRoute: ActivatedRoute,
		public dialog: MatDialog
	) {
		super(sharedService);

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

	getAllData() {
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

	onCancel() {
		this.dialogRef.close({ action: 'cancel' });
	}

	onSave() {
		let valueForm = this.bookFormGroup.value;
		let dataJSON = {
			// "entityId": valueForm.entityId,
			// "entityType": "book",
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			"link": valueForm.link,
			"categoryIds": valueForm.categoryIds,
			"catalogueId": valueForm.catalogueId,
			"tags": valueForm.tags,
			"metaDescription": valueForm.metaDescription,
			"metaTitle": valueForm.link,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
			"status": 'draft',
		}
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateBook(this.ID, dataJSON);
		}
		else {
			request = this.service.createBook(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				this.dialogRef.close({ action: 'save' });
			}
		})
	}

}
