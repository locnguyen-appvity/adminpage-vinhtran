import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, forkJoin, of, take, takeUntil } from 'rxjs';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
// import { TYPE_ORG } from '../../../../shared/data-manage';
import { Router } from '@angular/router';

@Component({
	selector: 'app-organization-info',
	templateUrl: './organization-info.component.html',
	styleUrls: ['./organization-info.component.scss'],
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
export class OrganizationInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public type: string = "giao_xu";
	public orgTypeName: string = "Giáo xứ";
	public canDelete: boolean = false;
	public saveAction: string = '';
	// public organizationList$: Observable<any>;
	// public typeList: any[];
	public localItem: any;
	public anniversarys: any[] = [];
	public groupID: string = "";
	public orgList: any[] = [];
	public groupsList: any[] = [];
	public entityList: any[] = [];

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public router: Router,
		public dialogRef: MatDialogRef<OrganizationInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.dialogData.type) {
			this.type = this.dialogData.type;
		}
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			this.localItem = this.dialogData.item
			this.ID = this.dialogData.item.id;
		}
		if (this.dialogData.groupID) {
			this.groupID = this.dialogData.groupID;
		}
		this.orgTypeName = this.sharedService.updateTypeOrg(this.type);
		this.buildFormGroup();
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			// if (this.target === 'edit') {
			// 	this.hasChangedGroup = this.isChangedForm(valueForm);
			// }
			// else {
			this.hasChangedGroup = true;
			// }
		})
		this.getAllData();
	}

	buildFormGroup() {
		// let dateOfBirth = (this.localItem && this.localItem.dateOfBirth) ? this.sharedService.convertDateStringToMomentUTC_0(this.localItem.dateOfBirth) : "";
		// let anniversary = (this.localItem && this.localItem.anniversary) ? this.sharedService.convertDateStringToMomentUTC_0(this.localItem.anniversary) : "";
		let status = (this.localItem && this.localItem.status == 'inactive') ? false : true;
		let groupID = this.localItem ? this.localItem.groupID : this.groupID;
		let _entityID = groupID ? `giao_hat_${groupID}` : "";
		if (this.localItem && this.localItem.entityID) {
			_entityID = `${this.localItem.entityType}_${this.localItem.entityID}`;
		}

		this.dataItemGroup = this.fb.group({
			items: this.fb.array([]),
			name: [this.localItem ? this.localItem.name : '', [Validators.required]],
			abbreviation: this.localItem ? this.localItem.abbreviation : '',
			groupID: groupID,
			// type: [this.localItem ? this.localItem.type : 'giao_xu', [Validators.required]],
			phoneNumber: this.localItem ? this.localItem.phoneNumber : '',
			email: this.localItem ? this.localItem.email : '',
			address: this.localItem ? this.localItem.address : '',
			description: this.localItem ? this.localItem.description : '',
			content: this.localItem ? this.localItem.content : '',
			entityID: this.localItem ? this.localItem.entityID : '',
			_entityID: _entityID,
			entityType: this.localItem ? this.localItem.entityType : '',
			status: status,
			// anniversarySaint: this.localItem ? this.localItem.anniversarySaint : '',
			// anniversary: anniversary
		})
		if (!this.isNullOrEmpty(this.groupID) && this.target != 'edit') {
			this.dataItemGroup.get("groupID").disable({
				onlySelf: true
			})
		}
	}

	onSelectItem(event: any, target: string) {
		if (target == "entityID") {
			this.dataItemGroup.get("entityType").setValue(event ? event.entityType : "");
			this.dataItemGroup.get("groupID").setValue(event ? event.groupID : "");
			this.dataItemGroup.get("entityID").setValue(event ? event.entityID : "");
		}
	}


	getAllData() {
		// this.typeList = TYPE_ORG;
		if (this.type == 'giao_xu') {
			this.getGroups().pipe(take(1)).subscribe();
		}
		else {
			forkJoin([this.getOrganizations(), this.getGroups()]).pipe(take(1)).subscribe({
				next: () => {
					this.entityList = this.orgList.concat(this.groupsList);
				}
			});
		}

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

	closeDialog() {
		this.dialogRef.close(null)
	}

	deleteItem() {
		this.saveAction = 'delete';
		this.dataProcessing = true;
		this.service.deleteOrganization(this.ID).pipe(take(1)).subscribe(() => {
			this.saveAction = '';
			this.dataProcessing = false;
			this.dialogRef.close('Deleted');
		})
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			latin: this.sharedService.getLinkOfName(valueForm.name, ' '),
			status: valueForm.status ? 'publish' : 'inactive',
			email: valueForm.email,
			phoneNumber: valueForm.phoneNumber,
			address: valueForm.address,
			groupID: this.dataItemGroup.get("groupID").value,
			entityID: this.dataItemGroup.get("entityID").value,
			entityType: this.dataItemGroup.get("entityType").value,
			abbreviation: valueForm.abbreviation,
			content: valueForm.content,
			description: valueForm.description,
			type: this.type
		}
		this.saveAction = 'save';
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updateOrganization(this.ID, dataJSON).pipe(take(1)).subscribe({
				next: () => {
					// this.createAnniversaryToTeamMember(this.ID).pipe(takeUntil(this.unsubscribe)).subscribe({
					// 	next: () => {
					this.saveAction = '';
					this.dataProcessing = false;
					this.dialogRef.close('OK');
					// },
					// error: error => {
					// 	this.saveAction = '';
					// 	this.dataProcessing = false;
					// 	this.dialogRef.close('OK');
					// }
					// });
				}
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createOrganization(dataJSON).pipe(take(1)).subscribe({
				next: (res) => {
					if (res && res.data && res.data.id) {
						this.saveAction = '';
						this.dataProcessing = false;
						this.router.navigate([`/admin/manage/${res.data.type}/detail/${res.data.id}`]);
						this.dialogRef.close('OK');
					}
					else {
						this.saveAction = '';
						this.dataProcessing = false;
						this.dialogRef.close('OK');
					}
				}
			})
		}
	}

	// createAnniversaryToTeamMember(organizationID: string) {
	// 	return new Observable(obs => {
	// 		let requests: Observable<any>[] = [];
	// 		let arrForm = this.dataItemGroup.get('items') as FormArray;
	// 		if (arrForm && arrForm.controls && arrForm.controls.length > 0) {
	// 			for (let control of arrForm.controls) {
	// 				let date = '';
	// 				let valueForm = control.value;
	// 				if (!this.isNullOrEmpty(valueForm.date)) {
	// 					date = valueForm.date.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
	// 				}
	// 				let dataJSON = {
	// 					"entityID": organizationID,
	// 					"entityType": "organization",
	// 					"name": valueForm.name,
	// 					"day": valueForm.day,
	// 					"date": date ? date : null,
	// 					"description": valueForm.description,
	// 					"status": 'active'
	// 				}
	// 				requests.push(this.service.createAnniversary(dataJSON));
	// 			}
	// 		}
	// 		if (requests.length > 0) {
	// 			forkJoin(requests).pipe(takeUntil(this.unsubscribe)).subscribe({
	// 				next: () => {
	// 					obs.next();
	// 					obs.complete();
	// 				},
	// 				error: error => {
	// 					obs.next();
	// 					obs.complete();
	// 				}
	// 			});
	// 		}
	// 		else {
	// 			obs.next();
	// 			obs.complete();
	// 		}
	// 	})
	// }

	getControls(frmGrp: FormGroup, key: string) {
		return (<FormArray>frmGrp.controls[key]).controls;
	}

}
