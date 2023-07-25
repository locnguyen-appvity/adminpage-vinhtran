import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
	public arrBooks: any[] = [];

	constructor(
		public dialogRef: MatDialogRef<ChapterInfoComponent>,
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
		this.chapterFormGroup = this.fb.group({
			title: "",
			link: "",
			metaDescription: "",
			entityId: "",
			entityType: "",
			photo: "",
			// categoryIds: [],
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
		this.router.navigate(['/admin/chapters/chapters-list']);
	}

	getAllData() {
		this.getBooks();
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

	onCancel() {
		this.dialogRef.close({ action: 'cancel' });
	}

	onSave() {
		let valueForm = this.chapterFormGroup.value;
		let dataJSON = {
			"entityId": valueForm.entityId ? valueForm.entityId : null,
			"entityType": valueForm.entityId ? "book" : "",
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			"link": valueForm.link,
			// "categoryIds": valueForm.categoryIds,
			"tags": valueForm.tags,
			"metaDescription": valueForm.metaDescription,
			"metaTitle": valueForm.link,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
			"status": "draft",
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
				this.dialogRef.close({ action: 'save' });
			}
		})
	}

}
