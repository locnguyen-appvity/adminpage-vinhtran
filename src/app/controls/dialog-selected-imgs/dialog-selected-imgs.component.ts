import { Component, Inject, Optional, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'se-dialog-selected-imgs',
    templateUrl: './dialog-selected-imgs.component.html',
    styleUrls: ['./dialog-selected-imgs.component.scss']
})
export class DialogSelectedImgsComponent extends SimpleBaseComponent {

    public title: string = "Chọn Hình Ảnh";
    public saveAction: string = "";
    public entityID: string = "";
    public entityType: string = "";
    public dataItems: any[] = []

    constructor(
        public linq: LinqService,
        public service: SharedService,
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
        public dialogRef: MatDialogRef<DialogSelectedImgsComponent>,
        public sharedService: SharedPropertyService,
        public store: Store<IAppState>,
        public renderer: Renderer2,
        public snackbar: MatSnackBar,
    ) {
        super(sharedService);
        if (this.dialogData.entityID) {
            this.entityID = this.dialogData.entityID;
        }
        if (this.dialogData.entityType) {
            this.entityType = this.dialogData.entityType;
        }
    }

    ngAfterViewInit() { }

    saveData() {
        this.dialogRef.close({ action: 'save', data: this.dataItems.filter(it => it.checked) });
    }

    closeDialog() {
        this.dialogRef.close({ action: 'cancel' });
    }


}

