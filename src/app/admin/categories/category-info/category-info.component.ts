import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil, } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'app-category-info',
    templateUrl: './category-info.component.html',
    styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent extends SimpleBaseComponent {

    public title: string = 'Thêm';
    public textSave: string = 'Thêm';
    public dataItemGroup: FormGroup;
    public hasChangedGroup: boolean = false;
    public target: string = "";
    public canDelete: boolean = false;
    public saveAction: string = '';
    public arrCategories: any[] = [];
    public arrCategoriesFilter: any[] = [];
    public parentItem: any;
    public localItem: any;

    constructor(public override sharedService: SharedPropertyService,
        private fb: FormBuilder,
        private service: SharedService,
        public dialogRef: MatDialogRef<CategoryInfoComponent>,
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
            this.dataItemGroup.get('link').setValue(this.sharedService.getLinkOfName(name));
        })
        this.dataItemGroup.get('level').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((level: any) => {
            this.getFilterCategories(level);
        })
        this.getCategories()
    }

    buildFormGroup() {
        let name = '';
        let link = '';
        let parentId = '';
        let level = 0;
        let status = true;
        let disabledParent = false;
        if (this.localItem) {
            name = this.localItem.name;
            link = this.localItem.link;
            parentId = this.localItem.parentId;
            level = this.localItem.level;
            status = this.localItem.deActive == 0 ? true : false;
        }
        else if (this.parentItem) {
            disabledParent = true;
            parentId = this.parentItem.id;
            level = this.parentItem.level + 1;
        }
        return this.fb.group({
            name: [name, [Validators.required]],
            link: link ? link : this.sharedService.getLinkOfName(name),
            level: { value: level, disabled: disabledParent },
            parentId: { value: parentId, disabled: disabledParent },
            status: status,
        })
    }

    isChangedForm(valueForm: any) {
        if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
            return true;
        }
        if (this.sharedService.isChangedValue(valueForm.level, this.dialogData.item.level)) {
            return true;
        }
        if (this.sharedService.isChangedValue(valueForm.parentId, this.dialogData.item.parentId)) {
            return true;
        }
        let status = this.dialogData.item.deActive == 0 ? true : false;
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
        this.service.deleteCategory(this.ID).pipe(take(1)).subscribe(() => {
            this.dataProcessing = false;
            this.dialogRef.close('Deleted');
        })
    }

    onSaveItem() {
        let valueForm = this.dataItemGroup.value;
        let level = this.dataItemGroup.get('level').value;
        let dataJSON = {
            name: valueForm.name,
            // deActive: valueForm.status ? 0 : 1,
            link: valueForm.link,
            level: level,
            parentId: level != 0 ? this.dataItemGroup.get('parentId').value : null
        }
        if (this.target == 'edit') {
            this.dataProcessing = true;
            this.service.updateCategory(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
        else {
            this.dataProcessing = true;
            this.service.createCategory(dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
    }

    getCategories() {
        this.arrCategories = [];
        this.service.getCategories().pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res && res.value) {
                    this.arrCategories = res.value;
                    this.getFilterCategories(this.dataItemGroup.get('level').value);
                }
            }
        })
    }

    getFilterCategories(level: number) {
        if (this.arrCategories && this.arrCategories.length > 0) {
            this.arrCategoriesFilter = this.arrCategories.filter(it => it.level == level - 1);
        }
        else {
            this.arrCategoriesFilter = [];
        }
    }

}
