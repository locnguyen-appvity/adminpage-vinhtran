import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, take, takeUntil, } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'app-media-file-info',
    templateUrl: './media-file-info.component.html',
    styleUrls: ['./media-file-info.component.scss']
})
export class MediaFileInfoComponent extends SimpleBaseComponent {

    public title: string = 'Thêm Media';
    public textSave: string = 'Thêm';
    public dataItemGroup: FormGroup;
    public hasChangedGroup: boolean = false;
    public hasChangedFile: boolean = false;
    public target: string = "";
    public saveAction: string = '';
    public localItem: any;
    public fileSelected: any;

    constructor(public override sharedService: SharedPropertyService,
        private fb: FormBuilder,
        private service: SharedService,
        public dialogRef: MatDialogRef<MediaFileInfoComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
        super(sharedService);

        this.target = this.dialogData.target;
        if (this.target === 'edit') {
            this.title = "Sửa Media";
            this.textSave = 'Lưu';
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
    }

    // "entityType": null,
    // "entityId": null,
    // "title": null,
    // "content": null,
    // "logo": null,
    // "mediaUrl": null,
    // "playerUrl": null,
    // "permalinkUrl": null,
    // "duration": null,
    // "status": null,

    buildFormGroup() {
        return this.fb.group({
            title: [this.localItem ? this.localItem.title : "", [Validators.required]],
            content: this.localItem ? this.localItem.content : "",
            entityType: this.localItem ? this.localItem.entityType : "",
            entityId: this.localItem ? this.localItem.entityId : "",
            mediaUrl: this.localItem ? this.localItem.mediaUrl : "",
            playerUrl: this.localItem ? this.localItem.playerUrl : "",
            duration: this.localItem ? this.localItem.duration : "",
            logo: this.localItem ? this.localItem.logo : "",
            status: this.localItem.status == 'active' ? true : false,
        })
    }

    isChangedForm(valueForm: any) {
        if (this.sharedService.isChangedValue(valueForm.title, this.dialogData.item.title)) {
            return true;
        }
        if (this.sharedService.isChangedValue(valueForm.entityType, this.dialogData.item.entityType)) {
            return true;
        }
        if (this.sharedService.isChangedValue(valueForm.entityId, this.dialogData.item.entityId)) {
            return true;
        }
        if (this.sharedService.isChangedValue(valueForm.mediaUrl, this.dialogData.item.mediaUrl)) {
            return true;
        }
        if (this.sharedService.isChangedValue(valueForm.playerUrl, this.dialogData.item.playerUrl)) {
            return true;
        }
        if (this.sharedService.isChangedValue(valueForm.duration, this.dialogData.item.duration)) {
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
        this.service.deleteMediaFile(this.ID).pipe(take(1)).subscribe(() => {
            this.dataProcessing = false;
            this.dialogRef.close('Deleted');
        })
    }

    valueChangesFile(event: any) {
        if (event && event.action == 'value-change') {
            this.hasChangedFile = true;
            this.fileSelected = event.data ? event.data : "";
        }
    }

    onSaveItem() {
        let valueForm = this.dataItemGroup.value;
        let dataJSON = {
            "entityType": valueForm.entityType,
            "entityId": valueForm.entityId,
            "title": valueForm.title,
            "content": valueForm.content,
            "logo": this.fileSelected ? this.fileSelected.filePath : valueForm.logo,
            "mediaUrl": valueForm.mediaUrl,
            "playerUrl": valueForm.playerUrl,
            "permalinkUrl": valueForm.permalinkUrl,
            "duration": valueForm.duration,
            "status": valueForm.status ? 'active' : 'inactive',
        }
        if (this.target == 'edit') {
            this.dataProcessing = true;
            this.service.updateMediaFile(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
        else {
            this.dataProcessing = true;
            this.service.createMediaFile(dataJSON).pipe(take(1)).subscribe(() => {
                this.dataProcessing = false;
                this.dialogRef.close('OK');
            })
        }
    }

}
