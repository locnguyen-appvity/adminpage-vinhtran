
import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatTooltipModule,
        SharedModule
    ],
    declarations: [AboutComponent],
    exports: [AboutComponent]
})

export class AboutModule {
}
