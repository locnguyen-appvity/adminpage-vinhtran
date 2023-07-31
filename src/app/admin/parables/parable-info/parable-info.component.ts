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
	selector: 'app-parable-info',
	templateUrl: './parable-info.component.html',
	styleUrls: ['./parable-info.component.scss'],
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
export class ParableInfoComponent extends SimpleBaseComponent {
	public parableFormGroup: FormGroup;
	public arrCategories: any[] = [];
	public arrTags: any[] = [];
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Lời Chúa";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public arrAuthors$: Observable<any>;
	private fileSelected: any;
	public type: string = "loi_chua";

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
		if (this.router.url.includes("tu_ngu_kinh_thanh")) {
			this.type = "tu_ngu_kinh_thanh";
		}
		if (!this.isNullOrEmpty(this.ID)) {
			this.getParable();
		}
		this.parableFormGroup = this.fb.group({
			title: "",
			type: this.type,
			link: "",
			metaDescription: "",
			quotation: "",
			content: "",
			// categoryIds: [],
			// eventDate: "",
			// address: '',
			authorId: '',
			// tags: [],
			metaKeyword: [],
			status: "Draft",
			// hotNew: false,
		});
		this.parableFormGroup.get('title').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
			this.parableFormGroup.get('link').setValue(this.sharedService.getLinkOfName(name));
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
		this.router.navigate([`/admin/${this.type}/list`]);
	}

	getAllData() {
		this.getCategories();
		this.getAuthors();
	}

	getParable() {
		this.service.getParable(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.parableFormGroup.patchValue({
						title: this.localItem.title,
						type: this.localItem.type,
						link: this.localItem.link,
						metaDescription: this.localItem.metaDescription,
						content: this.localItem.content,
						categoryIds: this.localItem.categoryIds,
						metaKeyword: this.localItem._metaKeyword,
						authorId: this.localItem.authorId,
						quotation: this.localItem.quotation,
						tags: this.localItem.tags,
						photo: this.localItem.photo
						// hotNew: this.localItem.hotNew
					});
				}
			}
		})
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

	valueChangesFile(event: any) {
		if (event && event.action == 'value-change') {
			this.fileSelected = event.data ? event.data : "";
		}
	}

	getCategories() {
		this.arrCategories = [];
		this.service.getCategories().pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value) {
					this.arrCategories = res.value;
				}
			}
		})
	}

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


	onCancel() {
		this.router.navigate([`/admin/${this.type}/list`]);
	}

	onSave(status: string) {
		let valueForm = this.parableFormGroup.value;
		let dataJSON = {
			"authorId": valueForm.authorId,
			"status": status,
			"type": valueForm.type,
			"title": valueForm.title,
			"photo": this.fileSelected ? this.fileSelected.filePath : "",
			"link": valueForm.link,
			"content": valueForm.content,
			"quotation": valueForm.quotation,
			"metaDescription": valueForm.metaDescription,
			"metaTitle": valueForm.link,
			"metaKeyword": valueForm.metaKeyword ? valueForm.metaKeyword.join("~") : "",//valueForm.metaKeyword,
		}
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateParable(this.ID, dataJSON);
		}
		else {
			request = this.service.createParable(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.router.navigate([`/admin/${this.type}/list`]);
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
