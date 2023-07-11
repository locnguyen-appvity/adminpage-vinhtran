import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, take, takeUntil } from 'rxjs';
import { DialogSelectedImgsComponent } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.component';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-contemplation-info',
	templateUrl: './contemplation-info.component.html',
	styleUrls: ['./contemplation-info.component.scss'],
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
export class ContemplationInfoComponent extends SimpleBaseComponent {
	public contemplationFormGroup: FormGroup;
	// public arrCategories: any[] = [];
	// public arrTags: any[] = [];
	// private tagsSelect: any = [];
	private fileSelected: any;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Suy Niệm";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public arrAuthors$: Observable<any>;
	public arrParables$: Observable<any>;

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
			this.getContemplation();
		}
		this.contemplationFormGroup = this.fb.group({
			title: "",
			link: "",
			metaDescription: "",
			content: "",
			loiChuaId: "",
			categoryIds: [],
			eventDate: "",
			address: '',
			authorId: '',
			tags: [],
			metaKeyword: [],
			hotNew: false
		});
		this.contemplationFormGroup.get('title').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
			this.contemplationFormGroup.get('link').setValue(this.sharedService.getLinkOfName(name));
		})
		this.getAllData();
	}

	openDialogImg(editor: any) {
		let config: any = {
			data: {
				entityID: "",
				entityType: "",
				hasGetData: false
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '90vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(DialogSelectedImgsComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
			}
		})
	}

	routeToBack() {
		this.router.navigate(['/admin/contemplations/contemplations-list']);
	}

	getAllData() {
		// this.getCategories();
		// this.getTags();
		this.getAuthors();
		this.getParables();
	}

	// valueChangeChip(event: any) {
	// 	if (event.action == 'change-value') {
	// 		this.tagsSelect = event.data;
	// 	}
	// }

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

	valueChangesFile(event: any) {
		if (event && event.action == 'value-change') {
			this.fileSelected = event.data ? event.data : "";
		}
		else if (event && event.action == 'clear') {
			this.contemplationFormGroup.get('photo').setValue("");
			this.fileSelected = "";

		}
	}

	getContemplation() {
		this.service.getContemplation(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.contemplationFormGroup.patchValue({
						title: this.localItem.title,
						link: this.localItem.link,
						metaDescription: this.localItem.metaDescription,
						content: this.localItem.content,
						categoryIds: this.localItem.categoryIds,
						metaKeyword: this.localItem._metaKeyword,
						loiChuaId: this.localItem.loiChuaId,
						authorId: this.localItem.authorId,
						// address: this.localItem.title,
						tags: this.localItem.tags,
						photo: this.localItem.photo
						// hotNew: this.localItem.hotNew
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
	// 			if (res && res.value.length > 0) {
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

	getParables() {
		this.service.getParables().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					for (let item of res.value) {
						item.name = item.quotation;
					}
					items = res.value;
				}
				this.arrParables$ = of(items);
			}
		})
	}


	onCancel() {
		this.router.navigate(['/admin/contemplations/contemplations-list']);
	}

	onSave(status: string) {
		let valueForm = this.contemplationFormGroup.value;
		let dataJSON = {
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			"link": valueForm.link,
			"loiChuaId": valueForm.loiChuaId,
			"authorId": valueForm.authorId,
			"content": valueForm.content,
			"categoryIds": valueForm.categoryIds,
			"tags": valueForm.tags,
			"metaDescription": valueForm.metaDescription,
			"metaTitle": valueForm.link,
			"topLevel": null,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
			"status": status,
			"eventDate": null,
			"visit": 0,
			"slideId": null
		}
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateContemplation(this.ID, dataJSON);
		}
		else {
			request = this.service.createContemplation(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.router.navigate(['/admin/contemplations/contemplations-list']);
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
