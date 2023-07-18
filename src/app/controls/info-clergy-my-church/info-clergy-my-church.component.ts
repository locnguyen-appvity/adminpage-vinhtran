import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Observable, of, take, takeUntil } from 'rxjs';
import { POSITION, TYPE_CLERGY } from 'src/app/shared/data-manage';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-info-clergy-my-church',
	templateUrl: './info-clergy-my-church.component.html',
	styleUrls: ['./info-clergy-my-church.component.scss'],
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
export class InfoClergyMyChurchComponent extends SimpleBaseComponent implements OnChanges {

	@Input() item: any;
	@Output() valueChange: EventEmitter<any> = new EventEmitter();
	public clergysList: any[] = [];
	public positionList: any[] = POSITION;
	public typeList: any[] = TYPE_CLERGY;
	public formGroupControl: FormGroup;
	public haschangedFormGroup: boolean = false;

	constructor(
		public sharedService: SharedPropertyService,
		private service: SharedService,
		private fb: FormBuilder) {
		super(sharedService);
		this.getAllData();
		this.formGroupControl = this.buildFormGroupStepClergy(this.item);
		this.initialFormGroupInfoChange();
	}

	initialFormGroupInfoChange() {
		this.formGroupControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (valueForm: any) => {
				if (this.item) {
					this.haschangedFormGroup = this._haschangedFormGroup(valueForm);
				}
				else {
					this.haschangedFormGroup = true;
				}
			}
		})
	}

	_haschangedFormGroup(valueForm: any) {
		let startDate = '';
		if (valueForm.startDate) {
			startDate = valueForm.startDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
		}
		let endDate = '';
		if (valueForm.endDate) {
			endDate = valueForm.endDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
		}
		if (this.sharedService.isChangedValue(valueForm.clergyID, this.item.clergyID)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.position, this.item.position)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.type, this.item.type)) {
			return true;
		}
		if (this.sharedService.isChangedValue(startDate, this.item.startDate)) {
			return true;
		}
		if (this.sharedService.isChangedValue(endDate, this.item.endDate)) {
			return true;
		}
		return false;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['item'] && this.item) {
			this.updateDataFormGroupStepClergy(this.item)
		}
	}

	valueChangeAutocomplete(event: any, target: string) {
		if (target == 'clergyID') {
			if (!this.isNullOrEmpty(event)) {
				let clergy = this.sharedService.getValueAutocomplete(event, this.clergysList);
				if (clergy && clergy.position) {
					this.formGroupControl.get('position').setValue(clergy.position);
				}
				if (clergy && clergy.type) {
					this.formGroupControl.get('type').setValue(clergy.type);
				}
			}
		}
	}

	getAllData() {
		this.getClergys();
	}

	getClergys() {
		this.clergysList = [];
		this.service.getClergies().pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					for (let item of res.value) {
						item.name = `${item.stName} ${item.name}`;
					}
					this.clergysList = res.value;
				}
			}
		})
	}

	buildFormGroupStepClergy(item: any) {
		let startDate = '';
		let endDate = '';
		if (item && item.startDate) {
			item._startDate = this.sharedService.convertDateStringToMomentUTC_0(item.startDate);
			startDate = item._startDate;
		}
		if (item && item.endDate) {
			item._endDate = this.sharedService.convertDateStringToMomentUTC_0(item.endDate);
			endDate = item._endDate;
		}
		return this.fb.group({
			id: item ? item.id : '',
			name: item ? item.name : '',
			clergyID: item ? item.clergyID : '',
			position: item ? item.position : 'chanh_xu',
			type: item ? item.type : 'linh_muc',
			startDate: startDate,
			endDate: endDate,
		});
	}

	updateDataFormGroupStepClergy(item: any) {
		let startDate = '';
		let endDate = '';
		if (item && item.startDate) {
			item._startDate = this.sharedService.convertDateStringToMomentUTC_0(item.startDate);
			startDate = item._startDate;
		}
		if (item && item.endDate) {
			item._endDate = this.sharedService.convertDateStringToMomentUTC_0(item.endDate);
			endDate = item._endDate;
		}
		this.formGroupControl.patchValue({
			id: item ? item.id : '',
			name: item ? item.name : '',
			clergyID: item ? item.clergyID : '',
			position: item ? item.position : 'chanh_xu',
			type: item ? item.type : 'linh_muc',
			startDate: startDate,
			endDate: endDate,
		});
	}

	removeStep() {
		if (this.item && this.item.id) {
			this.dataProcessing = true;
			// this.service.deleteDataInMyChurch(this.item.id).pipe(take(1)).subscribe({
			// 	next: () => {
			// 		this.dataProcessing = false;
			// 		this.valueChange.emit({ action: 'delete' });
			// 	}
			// })
		}
		else {
			this.valueChange.emit({ action: 'delete' });
		}
	}

	onCancel() {
		this.updateDataFormGroupStepClergy(this.item);
		this.haschangedFormGroup = false;
	}

	onSave() {
		if (this.item && this.item.id) {
			let valueForm = this.formGroupControl.value;
			let startDate = '';
			if (valueForm.startDate) {
				startDate = valueForm.startDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
			}
			let endDate = '';
			if (valueForm.endDate) {
				endDate = valueForm.endDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
			}
			let clergy = this.sharedService.getValueAutocomplete(valueForm.clergyID, this.clergysList);
			let dataJSON = {
				"icon": "",
				"name": clergy ? clergy.name : '',
				"clergyID": valueForm.clergyID,
				"position": valueForm.position,
				"startDate": startDate,
				"endDate": endDate,
				"type": valueForm.type
			}
			this.dataProcessing = true;
			// this.service.updateDataInMyChurch(this.item.id, dataJSON).pipe(take(1)).subscribe({
			// 	next: (res: any) => {
			// 		this.dataProcessing = false;
			// 		this.haschangedFormGroup = false;
			// 	}
			// })
		}
	}

}
