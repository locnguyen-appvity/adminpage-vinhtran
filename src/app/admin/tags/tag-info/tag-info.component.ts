import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, take, takeUntil, } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'app-tag-info',
    templateUrl: './tag-info.component.html',
    styleUrls: ['./tag-info.component.scss']
})
export class TagInfoComponent extends SimpleBaseComponent {

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
        public dialogRef: MatDialogRef<TagInfoComponent>,
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
        this.dataItemGroup.get('name').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
            this.dataItemGroup.get('noMark').setValue(this.sharedService.getLinkOfName(name));
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
        let name = '';
        let noMark = '';
        let context = '';
        let status = true;
        if (this.localItem) {
            name = this.localItem.name;
            noMark = this.localItem.noMark;
            context = this.localItem.context;
            status = this.localItem.status == 1 ? true : false;
        }
        return this.fb.group({
            name: [name, [Validators.required]],
            noMark: noMark ? noMark : this.sharedService.getLinkOfName(name),
            context: context,
            status: status,
        })
    }

    isChangedForm(valueForm: any) {
        if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
            return true;
        }
        let status = this.dialogData.item.status == 1 ? true : false;
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
        this.service.deleteTag(this.ID).pipe(take(1)).subscribe(() => {
            this.dataProcessing = false;
            this.dialogRef.close('Deleted');
        })
    }

    onSaveItem() {
        let valueForm = this.dataItemGroup.value;
        let dataJSON = {
            "name": valueForm.name,
            "noMark": valueForm.noMark,
            "context": valueForm.context
        }
        if (this.target == 'edit') {
            this.dataProcessing = true;
            this.service.updateTag(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
        else {
            this.dataProcessing = true;
            this.service.createTag(dataJSON).pipe(take(1)).subscribe(() => {
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
