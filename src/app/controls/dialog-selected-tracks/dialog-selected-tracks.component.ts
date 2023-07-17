import { Component, Inject, Optional, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'se-dialog-selected-tracks',
    templateUrl: './dialog-selected-tracks.component.html',
    styleUrls: ['./dialog-selected-tracks.component.scss']
})
export class DialogSelectedTracksComponent extends SimpleBaseComponent {

    public title: string = "Chọn Media Files";
    public saveAction: string = "";
    public target: string = "multi";
    public type: string = "podbean";
    public filesSelected: any[] = [];
    public folder: any;

    constructor(
        public linq: LinqService,
        public service: SharedService,
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
        public dialogRef: MatDialogRef<DialogSelectedTracksComponent>,
        public sharedService: SharedPropertyService,
        public store: Store<IAppState>,
        public renderer: Renderer2,
        public snackbar: MatSnackBar,
    ) {
        super(sharedService);
        if (this.dialogData.target) {
            this.target = this.dialogData.target;
        }
        if (this.dialogData.type) {
            this.type = this.dialogData.type;
        }
        if (this.dialogData.folder) {
            this.folder = this.dialogData.folder;
        }
    }

    valueChangesFile(event: any) {
        if (event && event.action == 'value-change') {
            this.filesSelected = [];
            if (this.target == "multi") {
                this.filesSelected = event.data;
            }
            else if (event.data && event.data[0]) {
                this.filesSelected.push(event.data[0]);
            }
        }
    }

    saveData() {
        this.dataProcessing = true;
        this.saveAction = 'save';
        this.onSaveItems(this.filesSelected).pipe(takeUntil(this.unsubscribe)).subscribe({
            next: () => {
                this.dataProcessing = false;
                this.saveAction = '';
                this.dialogRef.close('OK');
            },
            error: error => {
                console.log(error);
            }
        });
    }

    onSaveItems(files: any) {
        return new Observable(obs => {
            this.dataProcessing = true;
            let sub = new BehaviorSubject(0);
            sub.subscribe({
                next: (index: number) => {
                    if (index < files.length) {
                        if (files[index]) {
                            let valueForm = files[index];
                            let dataJSON = {
                                "entityType": valueForm.entityType,
                                "entityId": valueForm.entityId,
                                "title": valueForm.title,
                                "content": valueForm.content,
                                "logo": valueForm.logo,
                                "mediaUrl": valueForm.mediaUrl,
                                "playerUrl": valueForm.playerUrl,
                                "permalinkUrl": valueForm.permalinkUrl,
                                "duration": valueForm.duration,
                                "folderId": this.folder.id,
                                "embed": valueForm.embed,
                                "isAuto": valueForm.isAuto,
                                "status": valueForm.status,
                            }
                            this.service.createMediaFile(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
                                next: () => {
                                    index++;
                                    sub.next(index);
                                },
                                error: error => {
                                    console.log(error);
                                    index++;
                                    sub.next(index);
                                }
                            });

                        }
                        else {
                            index++;
                            sub.next(index);
                        }
                    }
                    else {
                        sub.complete();
                        sub.unsubscribe();
                        obs.next();
                        obs.complete();
                    }

                }
            });
        })
    }

    closeDialog() {
        this.dialogRef.close({ action: 'cancel' });
    }


}

