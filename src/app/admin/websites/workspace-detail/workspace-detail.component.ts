import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { WORKSPACEINFO } from './workspace-fields';
import { Observable, forkJoin, take } from 'rxjs';

@Component({
    selector: 'app-workspace-detail',
    templateUrl: './workspace-detail.component.html',
    styleUrls: ['./workspace-detail.component.scss']
})
export class WorkspaceDetailComponent extends SimpleBaseComponent {

    public workspaceGroup: FormGroup;
    public workspaceFields: any = WORKSPACEINFO;

    constructor(
        private service: SharedService,
        public sharedService: SharedPropertyService,
        public snackbar: MatSnackBar,
        private fb: FormBuilder,

    ) {
        super(sharedService);
        this.updateFormControl();
    }

    valueChangesFile(event: any) {
        if (event && event.action == 'value-change') {
            this.workspaceGroup.get('logo').setValue(event.data ? event.data.filePath : "");
        }
        else if (event && event.action == 'clear') {
            this.workspaceGroup.get('logo').setValue("");
        }
    }

    updateFormControl() {
        let formGroup = {};
        let filters = [];
        for (let field of this.workspaceFields) {
            formGroup[field.code] = [this.isNullOrEmpty(field.value) ? "" : field.value, { required: field.required }];
            filters.push(`code eq '${field.code}'`);
        }
        this.workspaceGroup = this.fb.group(formGroup);
        this.getWorkspaceSettings(filters.join(" or "));
    }

    getWorkspaceSettings(filter: any) {
        let options = {
            filter: filter
        }
        this.service.getWorkspaceSettings(options).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res && res.value && res.value.length > 0) {
                    for (let item of res.value) {
                        this.updateWorkspaceField(item);
                    }
                }
            }
        })
    }

    updateWorkspaceField(item: any) {
        for (let field of this.workspaceFields) {
            if (item.code == field.code) {
                field.id = item.id;
                field.value = item.value;
                this.workspaceGroup.get(field.code).setValue(item.value);
                return;
            }
        }
    }

    onCancel() {
        let filters = [];
        for (let field of this.workspaceFields) {
            filters.push(`code eq '${field.code}'`);
        }
        this.getWorkspaceSettings(filters.join(" or "));
    }

    onSave() {
        let formValue = this.workspaceGroup.value;
        let requests: Observable<any>[] = [];
        let filters = [];
        for (let field of this.workspaceFields) {
            filters.push(`code eq '${field.code}'`);
            if (this.sharedService.isChangedValue(field.value, formValue[field.code])) {
                let dataJSON = {
                    code: field.code,
                    value: formValue[field.code]
                }
                if (!this.isNullOrEmpty(field.id)) {
                    requests.push(this.service.updateWorkspaceSetting(field.id, dataJSON));
                }
                else {
                    requests.push(this.service.createWorkspaceSetting(dataJSON))
                }
            }
        }
        if(requests && requests.length > 0){
            forkJoin(requests).pipe(take(1)).subscribe({
                next: () => {
                    let snackbarData: any = {
                        key: 'saved-item',
                        message: 'Lưu Thành Công'
                    };
                    this.showInfoSnackbar(snackbarData);
                    this.getWorkspaceSettings(filters.join(" or "));
                }
            })
        }
    }

    showInfoSnackbar(dataInfo: any) {
        this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
            duration: 5000,
            data: dataInfo,
            horizontalPosition: 'start'
        });
    }

}
