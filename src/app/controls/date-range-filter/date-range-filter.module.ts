
import { NgModule } from '@angular/core';
import { DateRangeFilterComponent } from './date-range-filter.component';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CustomDateRangeComponent } from './custom-date-picker/custom-date-range.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
    imports: [
        SharedModule,
        MatInputModule,
        MatMenuModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatIconModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatTooltipModule,
    ],
    declarations: [DateRangeFilterComponent, CustomDateRangeComponent],
    exports: [DateRangeFilterComponent]
})

export class DateRangeFilterModule {
    constructor(private mdIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer) {
        this.mdIconRegistry.addSvgIcon('ic_today_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_today_48px.svg'));
        this.mdIconRegistry.addSvgIcon('ic_navigate_next', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_navigate_next.svg'));
        this.mdIconRegistry.addSvgIcon('ic_navigate_before', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_navigate_before.svg'));
    }
}
