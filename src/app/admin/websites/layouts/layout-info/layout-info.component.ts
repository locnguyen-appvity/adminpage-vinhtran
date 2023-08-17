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
	selector: 'app-layout-info',
	templateUrl: './layout-info.component.html',
	styleUrls: ['./layout-info.component.scss']
})
export class LayoutInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public type: string = "giao_xu";
	public localItem: any;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public router: Router,
		public dialogRef: MatDialogRef<LayoutInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.dialogData.type) {
			this.type = this.dialogData.type;
		}
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.ID = this.dialogData.item.id;
		}
		this.buildFormGroup();
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			this.hasChangedGroup = true;
		})
	}

	buildFormGroup() {
		// let dateOfBirth = (this.localItem && this.localItem.dateOfBirth) ? this.sharedService.convertDateStringToMomentUTC_0(this.localItem.dateOfBirth) : "";
		// let anniversary = (this.localItem && this.localItem.anniversary) ? this.sharedService.convertDateStringToMomentUTC_0(this.localItem.anniversary) : "";
		let status = (this.localItem && this.localItem.status == 'inactive') ? false : true;

		this.dataItemGroup = this.fb.group({
			name: [this.localItem ? this.localItem.name : '', [Validators.required]],
			type: this.type,
			status: status,
		})
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			type: this.type
		}
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updateLayout(this.ID, dataJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dataProcessing = false;
					this.dialogRef.close('OK');
				}
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createLayout(dataJSON).pipe(take(1)).subscribe({
				next: (res) => {
					if (res && res.data && res.data.id) {
						this.dataProcessing = false;
						this.dialogRef.close('OK');
					}
					else {
						this.dataProcessing = false;
						this.dialogRef.close('OK');
					}
				}
			})
		}
	}

	getControls(frmGrp: FormGroup, key: string) {
		return (<FormArray>frmGrp.controls[key]).controls;
	}

}
