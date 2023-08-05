import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, take, takeUntil, } from 'rxjs';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'app-notification-post-info',
    templateUrl: './notification-post-info.component.html',
    styleUrls: ['./notification-post-info.component.scss'],
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
export class NotificationPostInfoComponent extends SimpleBaseComponent {

    public title: string = 'Thêm';
    public textSave: string = 'Thêm';
    public dataItemGroup: FormGroup;
    public hasChangedGroup: boolean = false;
    public target: string = "";
    public canDelete: boolean = false;
    public saveAction: string = '';
    public arrCategoriesFilter: any[] = [];
    public parentItem: any;
    public localItem: any;

    constructor(public override sharedService: SharedPropertyService,
        private fb: FormBuilder,
        private service: SharedService,
        public dialogRef: MatDialogRef<NotificationPostInfoComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
        super(sharedService);

        this.target = this.dialogData.target;
        if (this.target === 'edit') {
            this.title = "Sửa";
            this.textSave = 'Lưu';
            this.canDelete = false;
            this.localItem = this.dialogData.item
            this.ID = this.dialogData.item.id;

        }
        else {
            if (this.dialogData.parentItem) {
                this.parentItem = this.dialogData.parentItem;
            }
        }
        this.dataItemGroup = this.buildFormGroup();
        this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
            // if (this.target === 'edit') {
            //     this.hasChangedGroup = this.isChangedForm(valueForm);
            // }
            // else {
            this.hasChangedGroup = true;
            // }
        })
        this.dataItemGroup.get('title').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((title: any) => {
            this.dataItemGroup.get('link').setValue(this.sharedService.getLinkOfName(title));
        })
    }

    // {
    // 	"name": "dfadsfasd",
    // 	"code": "sdfasdfasd",
    // 	"quotation": "fasdfasdf",
    // 	"parableID": "d889cfa5-ff1b-44b4-aeb2-2c6ced44799d",
    // 	"date": null,
    // 	"status": null,
    // 	"created": null,
    // 	"modified": null,
    // 	"createdBy": null,
    // 	"modifiedBy": null,
    // 	"id": "d889cfa5-ff1b-44b4-aeb2-2c6ced44799d"
    // }

    buildFormGroup() {
        if (this.localItem && this.localItem.startDate) {
            this.localItem._startDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.startDate)
        }
        if (this.localItem && this.localItem.endDate) {
            this.localItem._endDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.endDate)
        }
        return this.fb.group({
            title: [this.localItem ? this.localItem.title : "", [Validators.required]],
            metaDescription: this.localItem ? this.localItem.metaDescription : "",
            endDate: this.localItem ? this.localItem._endDate : this.sharedService.moment(),
            startDate: [this.localItem ? this.localItem._startDate : this.sharedService.moment(), [Validators.required]],
            link: this.localItem ? this.localItem.link : "",
            status: this.localItem ? this.localItem.status : "",
        })
    }

    // isChangedForm(valueForm: any) {
    //     if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
    //         return true;
    //     }
    //     let status = this.dialogData.item.status == 1 ? true : false;
    //     if (this.sharedService.isChangedValue(valueForm.status, status)) {
    //         return true;
    //     }
    //     return false;
    // }

    closeDialog() {
        this.dialogRef.close(null)
    }

    deleteItem() {
        this.dataProcessing = true;
        this.service.deleteNotificationPost(this.ID).pipe(take(1)).subscribe(() => {
            this.dataProcessing = false;
            this.dialogRef.close('Deleted');
        })
    }

    onSaveItem() {
        let valueForm = this.dataItemGroup.value;
        let dataJSON =
        {
            "title": valueForm.title,
            "metaDescription": valueForm.metaDescription,
            "link": valueForm.link,
            "startDate": this.sharedService.ISOStartDay(valueForm.startDate),
            "endDate": this.sharedService.ISOStartDay(valueForm.endDate),
            "status": valueForm.status,
        }

        if (this.target == 'edit') {
            this.dataProcessing = true;
            this.service.updateNotificationPost(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
        else {
            this.dataProcessing = true;
            this.service.createNotificationPost(dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
    }

}
