import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, take, takeUntil, } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'app-catalog-info',
    templateUrl: './catalog-info.component.html',
    styleUrls: ['./catalog-info.component.scss']
})
export class CatalogInfoComponent extends SimpleBaseComponent {

    public title: string = 'Thêm';
    public textSave: string = 'Thêm';
    public dataItemGroup: FormGroup;
    public hasChangedGroup: boolean = false;
    public target: string = "";
    public canDelete: boolean = false;
    public saveAction: string = '';
    public localItem: any;

    constructor(public override sharedService: SharedPropertyService,
        private fb: FormBuilder,
        private service: SharedService,
        public dialogRef: MatDialogRef<CatalogInfoComponent>,
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
    }

    buildFormGroup() {
        let name = '';
        let link = '';
        let context = '';
        let status = true;
        if (this.localItem) {
            name = this.localItem.name;
            link = this.localItem.link;
            context = this.localItem.context;
            status = this.localItem.status == 'active' ? true : false;
        }
        return this.fb.group({
            name: [name, [Validators.required]],
            context: context,
            link: link,
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
        this.service.deleteCatalog(this.ID).pipe(take(1)).subscribe(() => {
            this.dataProcessing = false;
            this.dialogRef.close('Deleted');
        })
    }

    onSaveItem() {
        let valueForm = this.dataItemGroup.value;
        let dataJSON = {
            "name": valueForm.name,
            "link": valueForm.link,
            "context": valueForm.context,
            status: valueForm.status ? 'active' : 'inactive'
        }
        if (this.target == 'edit') {
            this.dataProcessing = true;
            this.service.updateCatalog(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
        else {
            this.dataProcessing = true;
            this.service.createCatalog(dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
    }

}
