import { NgModule } from '@angular/core';
import { DialogConfirmComponent } from './confirm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        SharedModule],
    declarations: [DialogConfirmComponent],
    exports: [DialogConfirmComponent]
})
export class DialogConfirmModule { }
