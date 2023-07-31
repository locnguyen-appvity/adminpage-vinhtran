import { NgModule } from '@angular/core';
import { EventsDailyComponent } from './events-daily.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
	declarations: [
		EventsDailyComponent
	],
	imports: [
		SharedModule,
		CarouselModule,
		MatInputModule,
		MatDatepickerModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule
	],
	exports: [EventsDailyComponent]
})
export class EventsDailyModule { }
