import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import { JoditAngularComponent } from 'jodit-angular';
import { Observable, forkJoin, take } from 'rxjs';
// import { DialogSelectedImgsComponent } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.component';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { TYPE_ORG } from '../../../../shared/data-manage';

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
	public groupsList: any = [];
	public arrMasses: any[] = [];
	public target: string = 'giao_xu'
	public orgList: any[] = [];
	public entityList: any[] = [];

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
		if (this.router.url.includes("giao_xu")) {
			this.target = 'giao_xu';
		}
		else if (this.router.url.includes("giao_diem")) {
			this.target = 'giao_diem';
		}
		else if (this.router.url.includes("giao_ho")) {
			this.target = 'giao_ho';
		}
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (!this.isNullOrEmpty(this.ID)) {
			this.getOrganization();
		}
		this.getAllData();
	}

	onSelectItem(event: any, target: string) {
		if (target == "entityID") {
			this.dataItemGroup.get("entityType").setValue(event ? event.entityType : "");
			this.dataItemGroup.get("groupID").setValue(event ? event.groupID : "");
			this.dataItemGroup.get("entityID").setValue(event ? event.entityID : "");
		}
	}

	ngOnInit(): void {
		this.dataItemGroup = this.fb.group({
			// items: this.fb.array([]),
			name: "",
			type: "giao_xu",
			abbreviation: "",
			description: "",
			content: "",
			memberCount: 0,
			population: 0,
			groupID: '',
			entityID: "",
			entityType: "",
			phoneNumber: '',
			email: '',
			address: '',
			anniversary: '',
			photo: '',
			_entityID: "",
		});
	}

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
			case 'active':
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
		this.router.navigate([`/admin/manage/${this.localItem.type}/list`]);
	}

	getAllData() {
		this.typeList = TYPE_ORG;
		this.getSaints();
		if (this.target == 'giao_xu') {
			this.getGroups().pipe(take(1)).subscribe();
		}
		else {
			forkJoin([this.getOrganizations(), this.getGroups()]).pipe(take(1)).subscribe({
				next: () => {
					this.entityList = this.orgList.concat(this.groupsList);
				}
			});
		}
		// this.getMasses();
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
		return new Observable(obs => {
			this.groupsList = [];
			let options = {
				select: 'id,name,type',
				filter: "type eq 'giao_hat' and status ne 'inactive'"
			}
			this.service.getGroups(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					if (res && res.value && res.value.length > 0) {
						for (let item of res.value) {
							item._id = `${item.type}_${item.id}`;
							item.groupID = item.id;
							item.groupName = this.sharedService.updateTypeOrg(item.type);
							item.entityID = "";
							item.entityType = "";
						}
						this.groupsList = res.value;
					}
					obs.next();
					obs.complete();
				}
			})
		})
	}

	getOrganizations() {
		return new Observable(obs => {
			this.orgList = [];
			let options = {
				select: 'id,name,groupID,type',
				filter: "type eq 'giao_xu' and status ne 'inactive'"
			}
			this.service.getOrganizations(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					if (res && res.value && res.value.length > 0) {
						for (let item of res.value) {
							item._id = `${item.type}_${item.id}`;
							item.groupName = this.sharedService.updateTypeOrg(item.type);
							item.entityID = item.id;
							item.entityType = item.type;
							item.groupID = item.groupID;
						}
						this.orgList = res.value;
					}
					obs.next();
					obs.complete();
				}
			})
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
					let groupID = this.localItem ? this.localItem.groupID : "";
					let _entityID = groupID ? `giao_hat_${groupID}` : "";
					if (this.localItem && this.localItem.entityID && this.localItem.entityType) {
						_entityID = `${this.localItem.entityType}_${this.localItem.entityID}`;
					}

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
						photo: this.localItem.photo,
						entityID: this.localItem.entityID,
						entityType: this.localItem.entityType,
						_entityID: _entityID,
					});
				}
			}
		})
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
			entityID: valueForm.entityID,
			entityType: valueForm.entityType,
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
				this.routeToBack();
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
