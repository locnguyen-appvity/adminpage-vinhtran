import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, debounceTime, forkJoin, of, take, takeUntil } from 'rxjs';
import { ANNIVERSARIES } from 'src/app/shared/data-manage';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-event-info',
	templateUrl: './event-info.component.html',
	styleUrls: ['./event-info.component.scss'],
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
export class EventInfoComponent extends SimpleBaseComponent {

	public dataItemGroup: FormGroup;
	public title: string = "Sự Kiện";
	public entityID: string = "";
	public entityName: string = "";
	public entityType: string = "";
	public eventType: string = "ngay_ky_niem";
	public localItem: any;
	public arrLocations$: Observable<any>;
	public arrSaints: any[] = [];
	public typeEvents: any[] = [];

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<EventInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		if (this.dialogData.item) {
			this.title = "Sửa Sự Kiện"
			this.localItem = this.dialogData.item;
		}
		if (this.dialogData.entityID) {
			this.entityID = this.dialogData.entityID;
		}
		if (this.dialogData.entityName) {
			this.entityName = this.dialogData.entityName;
		}
		if (this.dialogData.entityType) {
			this.entityType = this.dialogData.entityType;
		}
		if (this.dialogData.eventType) {
			this.eventType = this.dialogData.eventType;
		}
		this.dataItemGroup = this.initialEventGroup(this.localItem);
		if (this.localItem && this.localItem.status == 'auto') {
			this.dataItemGroup.get('name').disable({
				onlySelf: true
			})
		}
		this.dataItemGroup.get("date").valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), takeUntil(this.unsubscribe)).subscribe((value: any) => {
			if (this.dataItemGroup.get("date").valid) {
				if (!this.isNullOrEmpty(value)) {
					this.dataItemGroup.get("day").setValue(value.format('DD/MM'));
				}
				else {
					this.dataItemGroup.get("day").setValue("");
				}
			}
		})
		forkJoin({ organization: this.getOrganizations(), group: this.getGroups() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.organization && res.organization.length > 0) {
					items.push(...res.organization);
				}
				if (res && res.group && res.group.length > 0) {
					items.push(...res.group);
				}
				this.arrLocations$ = of(items);
			}
		})
		this.getSaints();
		this.typeEvents = ANNIVERSARIES.filter(it => !it.hasAuto);
	}

	initialEventGroup(item: any): FormGroup {
		let _locationID = "";
		if (item && item.locationType && item.locationID) {
			_locationID = `${item.locationType}_${item.locationID}`;
		}
		else if (this.entityType != 'clergy' && this.entityType && this.entityID) {
			_locationID = `${this.entityType}_${this.entityID}`
		}
		return this.fb.group({
			id: item ? item.id : '',
			name: [item ? item.name : '', Validators.required],
			day: [item ? item.day : '', Validators.required],
			stName: item ? item.description : '',
			date: item ? item._date : '',
			type: [item ? item.type : this.eventType, Validators.required],
			description: item ? item.description : '',
			content: item ? item.content : '',
			locationID: item ? item.locationID : (this.entityType != 'clergy' ? this.entityID : ''),
			_locationID: _locationID,
			locationType: item ? item.locationType : (this.entityType != 'clergy' ? 'clergy' : ''),
			locationName: item ? item.locationName : (this.entityType != 'clergy' ? this.entityName : ''),
		});
	}

	getSaints() {
		let options = {
			filter: "status eq 'active'"
		}
		this.service.getSaints(options).pipe(take(1)).subscribe((res: any) => {
			let items = [];
			if (res && res.value && res.value.length > 0) {
				items = res.value;
				for (let item of items) {
					item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
				}
			}
			this.arrSaints = items;

		})
	}

	getOrganizations() {
		return new Observable(obs => {
			let options = {
				filter: "status ne 'inactive' and type ne 'ban_chuyen_mon' and type ne 'ban_muc_vu'"
			}
			this.service.getOrganizations(options).pipe(take(1)).subscribe((res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
						item._id = `${item.type}_${item.id}`;
						item.groupName = this.sharedService.updateTypeOrg(item.type);
					}
				}
				obs.next(items);
				obs.complete();
			})
		})
	}

	getGroups() {
		return new Observable(obs => {
			let options = {
				filter: "status ne 'inactive'"
			}
			this.service.getGroups(options).pipe(take(1)).subscribe((res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
						item._id = `${item.type}_${item.id}`;
						item.groupName = this.sharedService.updateTypeOrg(item.type);
					}
				}
				obs.next(items);
				obs.complete();
			})
		})
	}

	onChangeValue(event: any, target: string) {
		if (target == "_locationID") {
			if (!this.isNullOrEmpty(this.dataItemGroup.get("locationID").value)) {
				this.dataItemGroup.get("locationID").setValue("");
				this.dataItemGroup.get("locationType").setValue("");
			}
		}
		else if (target == "stName") {
			this.dataItemGroup.get("description").setValue(event);
		}
	}

	valueChangeSelect(item: any, target: string) {
		if (target == "_locationID") {
			this.dataItemGroup.get("locationName").setValue(item.name);
			this.dataItemGroup.get("locationID").setValue(item.id);
			this.dataItemGroup.get("locationType").setValue(item.type);
		}
		else if (target == "stName") {
			this.dataItemGroup.get("description").setValue(item.name);
			this.dataItemGroup.get("day").setValue(item.anniversary);
		}
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON: any = {
			"entityID": this.entityID,
			"entityType": this.entityType,
			"name": this.dataItemGroup.get('name').value,
			"day": valueForm.day,
			"date": this.sharedService.ISOStartDay(valueForm.date),
			"description": valueForm.description,
			"content": valueForm.content,
			"locationName": valueForm.locationName,
			"locationID": valueForm.locationID,
			"locationType": valueForm.locationType
		}
		if (this.localItem && this.localItem.id) {
			this.dataProcessing = true;
			if (!this.localItem.hasAuto) {
				dataJSON.type = valueForm.type;
			}
			this.service.updateAnniversary(this.localItem.id, dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: () => {
					this.dataProcessing = false;
					this.dialogRef.close("OK")
				}
			})
		}
		else {
			dataJSON.type = valueForm.type;
			this.dataProcessing = true;
			this.service.createAnniversary(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
				next: () => {
					this.dataProcessing = false;
					this.dialogRef.close("OK")
				}
			})
		}
	}
}
