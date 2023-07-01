import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, forkJoin, of, take, takeUntil } from 'rxjs';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { TYPE_CLERGY } from '../../../../shared/data-manage';

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
	public organizationList$: Observable<any>;
	public typeList$: Observable<any>;
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
			this.getAnniversarys(this.ID);
		}
		this.buildFormGroup();
		if (this.target != 'edit') {
			let arrForm = this.dataItemGroup.get('items') as FormArray;
			arrForm.push(this.initialTripInfoGroup({
				name:'Ngày Sinh'
			}));
		}
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
			items: this.fb.array([]),
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

	initialTripInfoGroup(item: any): FormGroup {
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
		arrForm.push(this.initialTripInfoGroup({}));

		// let control = arrForm.controls[index];
		// this.initialValueChangeHost(control);
	}

	getAllData() {
		this.typeList$ = of(TYPE_CLERGY);
		this.getOrganizations();
		// this.getListClergyType();
		this.getSaints();
	}

	getAnniversarys(clergyID: string) {
		let options = {
			filter: `entityID eq ${clergyID} and entityType eq 'clergy'`
		}
		this.dataProcessing = true;
		this.service.getAnniversaries(options).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let anniversarys = [];
				if (res && res.value && res.value.length > 0) {
					let arrForm = this.dataItemGroup.get('items') as FormArray;
					anniversarys = res.value;
					for (let item of anniversarys) {
						if (item.date) {
							item._date = this.sharedService.convertDateStringToMomentUTC_0(item.date);
							item.dateView = item._date.format('DD/MM/YYYY');
						}
						arrForm.push(this.initialTripInfoGroup(item));
					}
				}
				this.anniversarys = anniversarys;
				this.dataProcessing = false;
			},
			error: error => {
				console.log(error);
			}
		});
	}

	valueChangeSelect(event: any) {
		if (!this.isNullOrEmpty(event)) {
			let saint = this.sharedService.getValueAutocomplete(event, this.saintList);
			if (saint && saint.anniversarySaint) {
				this.dataItemGroup.get("anniversarySaint").setValue(saint.anniversarySaint);
			}
		}
	}

	// isChangedForm(valueForm: any) {
	// 	let deActive = valueForm.status == true ? 0 : 1;
	// 	if (this.sharedService.isChangedValue(deActive, this.dialogData.item.deActive)) {
	// 		return true;
	// 	}
	// 	if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
	// 		return true;
	// 	}
	// 	if (this.sharedService.isChangedValue(valueForm.position, this.dialogData.item.position)) {
	// 		return true;
	// 	}
	// 	if (this.sharedService.isChangedValue(valueForm.type, this.dialogData.item.type)) {
	// 		return true;
	// 	}
	// 	if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
	// 		return true;
	// 	}
	// 	let dateOfBirth = this.sharedService.ISOStartDay(valueForm.dateOfBirth);
	// 	if (this.sharedService.isChangedValue(dateOfBirth, this.dialogData.item.dateOfBirth)) {
	// 		return true;
	// 	}
	// 	if (this.sharedService.isChangedValue(valueForm.anniversarySaint, this.dialogData.item.anniversarySaint)) {
	// 		return true;
	// 	}
	// 	let anniversary = this.sharedService.ISOStartDay(valueForm.anniversary);
	// 	if (this.sharedService.isChangedValue(anniversary, this.dialogData.item.anniversary)) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	getOrganizations() {
		this.organizationList$ = of([]);
		let options = {
			select:'id,name',
			filter: "type eq 'dong_tu'"
		}
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [{
					id: '-1',
					name: 'Giáo Phận Phú Cường'
				}]
				if (res && res.value && res.value.length > 0) {
					items.push(...res.value);
				}
				this.organizationList$ = of(items);
			}
		})
	}

	// getListClergyType() {
	// 	this.typeList$ = of([]);
	// 	// this.service.getListClergyType().pipe(take(1)).subscribe({
	// 	// 	next: (res: any) => {
	// 	// 		if (res && res.value && res.value.length > 0) {
	// 	// 			this.typeList$ = of(res.value);
	// 	// 		}
	// 	// 	}
	// 	// })
	// }

	getSaints() {
		this.saintList$ = of([]);
		this.saintList = [];
		let options = {
			select:'id,name'
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
			organizationID: valueForm.organizationID == '-1' ? "": valueForm.organizationID,
			type: valueForm.type
		}
		this.saveAction = 'save';
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updateClergy(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
				this.createAnniversaryToTeamMember(this.ID).pipe(takeUntil(this.unsubscribe)).subscribe({
					next: () => {
						this.saveAction = ''
						this.dataProcessing = false;
						this.dialogRef.close('OK');
					},
					error: error => {
						this.saveAction = ''
						this.dataProcessing = false;
						this.dialogRef.close('OK');
					}
				});
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createClergy(dataJSON).pipe(take(1)).subscribe(
				{
					next: (res) => {
						if (res && res.value && res.value.id) {
							this.createAnniversaryToTeamMember(res.value.id).pipe(takeUntil(this.unsubscribe)).subscribe({
								next: () => {
									this.saveAction = ''
									this.dataProcessing = false;
									this.dialogRef.close('OK');
								},
								error: error => {
									this.saveAction = ''
									this.dataProcessing = false;
									this.dialogRef.close('OK');
								}
							});
						}
						else {
							this.saveAction = ''
							this.dataProcessing = false;
							this.dialogRef.close('OK');
						}
					}
				})
		}
	}

	createAnniversaryToTeamMember(clergyID: string) {
		return new Observable(obs => {
			let requests: Observable<any>[] = [];
			let arrForm = this.dataItemGroup.get('items') as FormArray;
			if (arrForm && arrForm.controls && arrForm.controls.length > 0) {
				for (let control of arrForm.controls) {
					let date = '';
					let valueForm = control.value;
					if (!this.isNullOrEmpty(valueForm.date)) {
						date = valueForm.date.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
					}
					let dataJSON = {
						"entityID": clergyID,
						"entityType": "clergy",
						"name": valueForm.name,
						"day": valueForm.day,
						"date": date ? date : null,
						"description": valueForm.description
					}
					requests.push(this.service.createAnniversary(dataJSON));
				}
			}
			if (requests.length > 0) {
				forkJoin(requests).pipe(takeUntil(this.unsubscribe)).subscribe({
					next: () => {
						obs.next();
						obs.complete();
					},
					error: error => {
						obs.next();
						obs.complete();
					}
				});
			}
			else {
				obs.next();
				obs.complete();
			}
		})
	}

	getControls(frmGrp: FormGroup, key: string) {
		return (<FormArray>frmGrp.controls[key]).controls;
	}

}
