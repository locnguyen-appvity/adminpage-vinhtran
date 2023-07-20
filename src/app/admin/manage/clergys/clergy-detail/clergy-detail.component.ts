import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import { JoditAngularComponent } from 'jodit-angular';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
// import { DialogSelectedImgsComponent } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.component';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { LEVEL_CLERGY } from '../../../../shared/data-manage';

@Component({
	selector: 'app-clergy-detail',
	templateUrl: './clergy-detail.component.html',
	styleUrls: ['./clergy-detail.component.scss'],
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
export class ClergyDetailComponent extends SimpleBaseComponent implements OnInit {
	public dataItemGroup: FormGroup;
	public fileSelected: any;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Tu Sĩ";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public levelList: any[] = LEVEL_CLERGY;
	public saintList: any[] = [];
	public groupsList: any[] = [];
	public orgsList: any[] = [];
	public arrMasses: any[] = [];

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
			this.getClergy();
		}

	}

	ngOnInit(): void {
		this.dataItemGroup = this.fb.group({
			// items: this.fb.array([]),
			name: "",
			stName: "",
			type: "tu_trieu",
			level: "linh_muc",
			content: "",
			belongOrgId: '',
			phoneNumber: '',
			email: '',
			photo: '',
			motherName: '',
			fatherName: '',
			identityCardType: '',
			identityCardNumber: '',
			identityCardIssueDate: '',
			identityCardIssuePlace: '',
			parable: '',
			dateOfBirth: '',
			placeOfBirth: '',
			orgName: '',
			organizationID: '',

		});
		this.getAllData();
	}

	// {
	// 	"stName": "Giuse",
	// 	"name": "Nguyễn Văn Thể",
	// 	"type": "tu_trieu",
	// 	"organizationID": "1e8f563e-4543-4370-a091-0f07de220b85",
	// 	"phoneNumber": "",
	// 	"email": "",
	// 	"status": "publish",
	// 	"photo": "public/storage/images/840fa747-2dca-42f5-a368-69224c6b36af.png",
	// 	"content": null,
	// 	"dateOfBirth": null,
	// 	"placeOfBirth": null,
	// 	"fatherName": null,
	// 	"motherName": null,
	// 	"baptizeDate": null,
	// 	"confirmationDate": null,
	// 	"baptizePlace": null,
	// 	"confirmationPlace": null,
	// 	"bigSeminary": null,
	// 	"smallSeminary": null,
	// 	"bigSeminaryDate": null,
	// 	"smallSeminaryDate": null,
	// 	"identityCardNumber": null,
	// 	"identityCardType": null,
	// 	"identityCardIssueDate": null,
	// 	"identityCardIssuePlace": null,
	// 	"code": null,
	// 	"manageOrgId": null,
	// 	"belongOrgId": null,
	// 	"manageOrgPosition": null,
	// 	"level": "linh_muc",
	// 	"vowDate": null,//Ngày Khấn
	// 	"ripDate": null,
	// 	"ripOrgId": null,
	// 	"ripNote": null,
	// 	"note": null,
	// 	"parable": null,//Câu Châm ngôn
	// 	"birthOrgName": null,
	// 	"ripOrgName": null,
	// 	"orgName": null,
	// 	"created": "2023-07-03T00:00:00Z",
	// 	"modified": "2023-07-20T07:11:48.470276Z",
	// 	"createdBy": null,
	// 	"modifiedBy": null,
	// 	"id": "18f54830-9017-456d-a575-97439d31e697"
	// }

	// getControls(frmGrp: FormGroup, key: string) {
	// 	return (<FormArray>frmGrp.controls[key]).controls;
	// }

	// initialEventGroup(item: any): FormGroup {
	// 	return this.fb.group({
	// 		id: item ? item.id : '',
	// 		name: [item ? item.name : '', Validators.required],
	// 		day: [item ? item.day : '', Validators.required],
	// 		date: item ? item._date : '',
	// 		description: item ? item.description : '',
	// 	});
	// }

	// onAddSegment() {
	// 	let arrForm = this.dataItemGroup.get('items') as FormArray;
	// 	arrForm.push(this.initialEventGroup({}));

	// 	// let control = arrForm.controls[index];
	// 	// this.initialValueChangeHost(control);
	// }

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

	onAddClergy(type: string, item?: any) {

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
		this.router.navigate(['/admin/manage/clergys/clergys-list']);
	}

	getAllData() {
		this.getSaints();
		this.getGroups();
		this.getOrganizations();
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

	getGroups() {
		this.groupsList = [];
		let options = {
			select: 'id,name,type',
			filter: "type eq 'dong_tu'"
		}
		this.service.getGroups(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items.push(...res.value);
					for (let item of items) {
						item.name = `${this.sharedService.updateTypeOrg(item.type)} ${item.name}`
					}
				}
				this.groupsList = items;
			}
		})
	}

	getOrganizations() {
		this.orgsList = [];
		let options = {
			select: 'id,name,type',
			filter: "type eq 'dong_tu'"
		}
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items.push(...res.value);
					for (let item of items) {
						item.name = `${this.sharedService.updateTypeOrg(item.type)} ${item.name}`
					}
				}
				this.orgsList = items;
			}
		})
	}


	getClergy() {
		this.service.getClergy(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					if (this.localItem.dateOfBirth) {
						this.localItem._dateOfBirth = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.dateOfBirth);
					}
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.dataItemGroup.patchValue({
						name: this.localItem.name,
						stName: this.localItem.stName,
						email: this.localItem.email,
						phoneNumber: this.localItem.phoneNumber,
						belongOrgId: this.localItem.belongOrgId,
						content: this.localItem.content,
						type: this.localItem.type,
						level: this.localItem.level,
						photo: this.localItem.photo,
						motherName: this.localItem.motherName,
						fatherName: this.localItem.fatherName,
						identityCardType: this.localItem.identityCardType,
						identityCardNumber: this.localItem.identityCardNumber,
						identityCardIssueDate: this.localItem.identityCardIssueDate,
						identityCardIssuePlace: this.localItem.identityCardIssuePlace,
						parable: this.localItem.parable,
						dateOfBirth: this.localItem._dateOfBirth,
						placeOfBirth: this.localItem.placeOfBirth,
						orgName: this.localItem.orgName,
						organizationID: this.localItem.organizationID
					});
				}
			}
		})
	}

	onCancel() {
		this.router.navigate(['/admin/manage/clergys/clergys-list']);
	}

	onSave() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			stName: valueForm.stName,
			name: valueForm.name,
			email: valueForm.email,
			phoneNumber: valueForm.phoneNumber,
			photo: this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			belongOrgId: valueForm.level == 'tu_dong' ? valueForm.belongOrgId : null,
			type: valueForm.type,
			motherName: valueForm.motherName,
			fatherName: valueForm.fatherName,
			identityCardType: valueForm.identityCardType,
			level: valueForm.level,
			identityCardNumber: valueForm.identityCardNumber,
			identityCardIssueDate: valueForm.identityCardIssueDate,
			identityCardIssuePlace: valueForm.identityCardIssuePlace,
			parable: valueForm.parable,
			dateOfBirth: this.sharedService.ISOStartDay(valueForm.dateOfBirth),
			placeOfBirth: valueForm.placeOfBirth,
			orgName: valueForm.orgName,
			organizationID: valueForm.organizationID
		}
		let requests: Observable<any>[] = [];
		if (!this.isNullOrEmpty(this.ID)) {
			requests.push(this.service.updateClergy(this.ID, dataJSON));
		}
		else {
			requests.push(this.service.createClergy(dataJSON));
		}
		forkJoin(requests).pipe(take(1)).subscribe({
			next: () => {
				if (!this.isNullOrEmpty(this.ID)) {
					if (this.sharedService.isChangedValue(this.sharedService.ISOStartDay(valueForm.dateOfBirth), this.localItem.dateOfBirth)
						|| this.sharedService.isChangedValue(valueForm.placeOfBirth, this.localItem.placeOfBirth)
						|| this.sharedService.isChangedValue(valueForm.orgName, this.localItem.orgName)
						|| this.sharedService.isChangedValue(valueForm.organizationID, this.localItem.organizationID)
					) {
						let options = {
							filter: `type eq 'birth' and entityId eq ${this.ID} and entityType eq 'clergy'`,
							top: 1
						}
						this.service.getAnniversaries(options).pipe(take(1)).subscribe({
							next: (res: any) => {
								if (res && res.value && res.value[0]) {
									let dataJSON = {
										"name": valueForm.orgName,
										"day": valueForm.dateOfBirth ? valueForm.dateOfBirth.format("DD/MM") : "",
										"date": this.sharedService.ISOStartDay(valueForm.dateOfBirth),
										"locationName": valueForm.placeOfBirth,
										"locationID": valueForm.organizationID,
										"locationType": "organization"
									}
									this.dataProcessing = true;
									this.service.updateAnniversary(res.value[0].id, dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
										next: () => {
											this.dataProcessing = false;
											let snackbarData: any = {
												key: 'saved-item',
												message: 'Lưu Thành Công'
											};
											this.showInfoSnackbar(snackbarData);
											this.router.navigate(['/admin/manage/clergys/clergys-list']);
										}
									})
								}
								else {
									let snackbarData: any = {
										key: 'saved-item',
										message: 'Lưu Thành Công'
									};
									this.showInfoSnackbar(snackbarData);
									this.router.navigate(['/admin/manage/clergys/clergys-list']);
								}
							}
						})
					}
				}
				else {
					let snackbarData: any = {
						key: 'saved-item',
						message: 'Lưu Thành Công'
					};
					this.showInfoSnackbar(snackbarData);
					this.router.navigate(['/admin/manage/clergys/clergys-list']);
				}
			}
		})
	}

	onChangeValue(event: any, target: string) {
		if (target == "orgName") {
			if (!this.isNullOrEmpty(this.dataItemGroup.get("organizationID").value)) {
				this.dataItemGroup.get("organizationID").setValue(null);
			}
		}
	}

	valueChangeSelect(event: any, target: string) {
		if (target == "orgName") {
			this.dataItemGroup.get("organizationID").setValue(event);
		}
	}

	showInfoSnackbar(dataInfo: any) {
		this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
			duration: 5000,
			data: dataInfo,
			horizontalPosition: 'start'
		});
	}

}
