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
    selector: 'app-author-info',
    templateUrl: './author-info.component.html',
    styleUrls: ['./author-info.component.scss'],
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
export class AuthorInfoComponent extends SimpleBaseComponent {

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
    public arrListName$: Observable<any>;
    public arrListName: any[] = [];

    constructor(public override sharedService: SharedPropertyService,
        private fb: FormBuilder,
        private service: SharedService,
        public dialogRef: MatDialogRef<AuthorInfoComponent>,
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
            if (this.target === 'edit') {
                this.hasChangedGroup = this.isChangedForm(valueForm);
            }
            else {
                this.hasChangedGroup = true;
            }
        })
        this.getAllData()
    }

    getAllData() {
        this.getCategories().pipe(take(1)).subscribe({
            next: (items: any) => {
                this.arrListName.push(...items);
                this.arrListName$ = of(this.arrListName);
            }
        })
    }

    buildFormGroup() {
        let doB = this.localItem ? this.sharedService.convertDateStringToMomentUTC_0(this.localItem.doB) : "";
        return this.fb.group({
            name: [this.localItem ? this.localItem.name : '', [Validators.required]],
            email: this.localItem ? this.localItem.email : '',
            biography: this.localItem ? this.localItem.biography : '',
            phone: this.localItem ? this.localItem.phone : '',
            degree: this.localItem ? this.localItem.degree : '',
            doB: doB,
            status: this.localItem ? (this.localItem.status == 'active' ? true : false) : true,
        })
    }

    isChangedForm(valueForm: any) {
        if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
            return true;
        }
        let status = this.dialogData.item.status == 'active' ? true : false;
        if (this.sharedService.isChangedValue(valueForm.status, status)) {
            return true;
        }
        return false;
    }

    closeDialog() {
        this.dialogRef.close(null)
    }

    deleteItem() {
        this.dataProcessing = true;
        this.service.deleteAuthor(this.ID).pipe(take(1)).subscribe(() => {
            this.dataProcessing = false;
            this.dialogRef.close('Deleted');
        })
    }

    onSaveItem() {
        let valueForm = this.dataItemGroup.value;
        let dataJSON = {
            "name": valueForm.name,
            "email": valueForm.email,
            "phone": valueForm.phone,
            "biography": valueForm.biography,
            "doB": this.sharedService.ISOStartDay(valueForm.doB),
            "degree": valueForm.degree,
            "status": valueForm.status == true ? 'active' : 'inactive',
        }
        // let dataJSON = {
        //     "name": valueForm.name,
        //     "noMark": valueForm.noMark,
        //     "context": valueForm.context
        // }
        if (this.target == 'edit') {
            this.dataProcessing = true;
            this.service.updateAuthor(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
        else {
            this.dataProcessing = true;
            this.service.createAuthor(dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
    }

    getCategories() {
        return new Observable(obs => {
            this.service.getCategories().pipe(take(1)).subscribe({
                next: (res: any) => {
                    let data = [];
                    if (res && res.value) {
                        data = res.value;
                    }
                    obs.next(data);
                    obs.complete();
                }
            })
        })
    }

}
