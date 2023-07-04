import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, take, takeUntil } from 'rxjs';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { TYPE_CLERGY, TYPE_ORG } from '../../../../shared/data-manage';

@Component({
	selector: 'app-clergy-info',
	templateUrl: './clergy-info.component.html',
	styleUrls: ['./clergy-info.component.scss'],
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
export class ClergyInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public canDelete: boolean = false;
	public saveAction: string = '';
	public organizationList: any[] = [];
	public typeList: any[] = [];
	public typeOrgList: any[] = [];
	public saintList$: Observable<any>;
	public saintList: any[] = [];
	public localItem: any;
	public anniversarys: any[] = [];

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<ClergyInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			this.localItem = this.dialogData.item
			this.ID = this.dialogData.item.id;
			// this.getAnniversarys(this.ID);
		}
		this.buildFormGroup();
		// if (this.target != 'edit') {
		// 	let arrForm = this.dataItemGroup.get('items') as FormArray;
		// 	arrForm.push(this.initialTripInfoGroup({
		// 		name:'Ngày Sinh'
		// 	}));
		// }
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
		this.dataItemGroup = this.fb.group({
			// items: this.fb.array([]),
			name: [this.localItem ? this.localItem.name : '', [Validators.required]],
			stName: [this.localItem ? this.localItem.stName : '', [Validators.required]],
			organizationID: (this.localItem && this.localItem.organizationID) ? this.localItem.organizationID : '-1',
			type: [this.localItem ? this.localItem.type : 'linh_muc', [Validators.required]],
			phoneNumber: this.localItem ? this.localItem.phoneNumber : '',
			email: this.localItem ? this.localItem.email : '',
			status: status,
			// anniversarySaint: this.localItem ? this.localItem.anniversarySaint : '',
			// anniversary: anniversary
		})
	}

	getAllData() {
		this.typeList = TYPE_CLERGY;
		this.typeOrgList = TYPE_ORG;
		this.getOrganizations();
		// this.getListClergyType();
		this.getSaints();
	}

	getOrganizations() {
		this.organizationList = [];
		let options = {
			select: 'id,name,type',
			filter: "type eq 'dong_tu'"
		}
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [{
					id: '-1',
					name: 'Giáo Phận Phú Cường',
					type: 'giao_phan'
				}]
				if (res && res.value && res.value.length > 0) {
					for (let item of res.value) {
						this.updateNameOfTypeOrg(item);
					}
					items.push(...res.value);
				}
				this.organizationList = items;
			}
		})
	}

	updateNameOfTypeOrg(item: any) {
		switch (item.type) {
			case 'dong_tu':
				item.name = `Dòng ${item.name}`;
				break;
			case 'giao_xu':
				item.name = `Giáo Xứ ${item.name}`;
				break;
		}
	}

	getSaints() {
		this.saintList$ = of([]);
		this.saintList = [];
		let options = {
			select: 'id,name'
		}
		this.service.getSaints(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.saintList$ = of(res.value);
					this.saintList = res.value;
				}
			}
		})
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	deleteItem() {
		this.dataProcessing = true;
		this.saveAction = 'delete'
		this.service.deleteClergy(this.ID).pipe(take(1)).subscribe(() => {
			this.saveAction = ''
			this.dataProcessing = false;
			this.dialogRef.close('Deleted');
		})
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			stName: valueForm.stName,
			name: valueForm.name,
			status: valueForm.status ? 'active' : 'inactive',
			email: valueForm.email,
			phoneNumber: valueForm.phoneNumber,
			organizationID: valueForm.organizationID == '-1' ? "" : valueForm.organizationID,
			type: valueForm.type
		}
		this.saveAction = 'save';
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updateClergy(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
				this.saveAction = ''
				this.dataProcessing = false;
				this.dialogRef.close('OK');
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createClergy(dataJSON).pipe(take(1)).subscribe(
				{
					next: () => {
						this.saveAction = ''
						this.dataProcessing = false;
						this.dialogRef.close('OK');
					}
				})
		}
	}

}
