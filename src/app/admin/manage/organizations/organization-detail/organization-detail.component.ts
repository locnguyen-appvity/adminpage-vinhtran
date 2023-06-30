import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import { JoditAngularComponent } from 'jodit-angular';
import { Observable, of, take } from 'rxjs';
// import { DialogSelectedImgsComponent } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.component';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { TYPE_ORG } from '../../data-manage';

@Component({
	selector: 'app-organization-detail',
	templateUrl: './organization-detail.component.html',
	styleUrls: ['./organization-detail.component.scss'],
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
export class OrganizationDetailComponent extends SimpleBaseComponent implements OnInit {
	public dataItemGroup: FormGroup;
	public fileSelected: any;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Giáo Xứ";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public typeList: any[] = [];
	public saintList: any[] = [];

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
			this.getOrganization();
		}

	}

	ngOnInit(): void {
		this.dataItemGroup = this.fb.group({
			items: this.fb.array([]),
			name: "",
			type: "giao_xu",
			abbreviation: "",
			description: "",
			content: "",
			memberCount: 0,
			population: 0,
			groupID: '',
			phoneNumber: '',
			email: '',
			address: '',
			anniversary: '',
			photo: ''
		});
		this.getAllData();
	}

	getControls(frmGrp: FormGroup, key: string) {
		return (<FormArray>frmGrp.controls[key]).controls;
	}

	initialEventGroup(item: any): FormGroup {
		return this.fb.group({
			id: item ? item.id : '',
			name: [item ? item.name : '', Validators.required],
			day: [item ? item.day : '', Validators.required],
			date: item ? item._date : '',
			description: item ? item.description : '',
		});
	}

	onAddSegment() {
		let arrForm = this.dataItemGroup.get('items') as FormArray;
		arrForm.push(this.initialEventGroup({}));

		// let control = arrForm.controls[index];
		// this.initialValueChangeHost(control);
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
		this.router.navigate(['/admin/manage/organizations/organizations-list']);
	}

	getAllData() {
		this.typeList = TYPE_ORG;
		this.getSaints();
	}

	getSaints() {
		this.saintList = [];
		let options = {
			select: 'id,name'
		}
		this.service.getSaints(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.saintList = res.value;
				}
			}
		})
	}

	getOrganization() {
		this.service.getOrganization(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.dataItemGroup.patchValue({
						name: this.localItem.name,
						email: this.localItem.email,
						phoneNumber: this.localItem.phoneNumber,
						address: this.localItem.address,
						groupID: this.localItem.groupID,
						abbreviation: this.localItem.abbreviation,
						content: this.localItem.content,
						description: this.localItem.description,
						anniversary: this.localItem.anniversary,
						type: this.localItem.type,
						memberCount: this.localItem.memberCount,
						population: this.localItem.population,
						photo: this.localItem.photo
					});
				}
			}
		})
	}

	onCancel() {
		this.router.navigate(['/admin/manage/organizations/organizations-list']);
	}

	onSave(status: string) {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			status: status,
			email: valueForm.email,
			phoneNumber: valueForm.phoneNumber,
			address: valueForm.address,
			groupID: valueForm.groupID,
			abbreviation: valueForm.abbreviation,
			anniversary: valueForm.anniversary,
			content: valueForm.content,
			description: valueForm.description,
			type: valueForm.type,
			memberCount: valueForm.memberCount,
			population: valueForm.population,
			photo: this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
		}
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateOrganization(this.ID, dataJSON);
		}
		else {
			request = this.service.createOrganization(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.router.navigate(['/admin/manage/organizations/organizations-list']);
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
