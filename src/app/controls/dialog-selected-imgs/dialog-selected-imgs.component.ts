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
    public target: string = "multi";
    public filesSelected: any[] = [];

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
        if (this.dialogData.target) {
            this.target = this.dialogData.target;
        }
    }

    valueChangesFile(event: any) {
        if (event && event.action == 'value-changes') {
            this.filesSelected = event.data;
        }
    }

    ngAfterViewInit() { }

    saveData() {
        this.dialogRef.close({ action: 'save', data: this.filesSelected });
    }

    closeDialog() {
        this.dialogRef.close({ action: 'cancel' });
    }


}

