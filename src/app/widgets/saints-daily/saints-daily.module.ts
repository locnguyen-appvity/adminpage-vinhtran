import { NgModule } from '@angular/core';
import { SaintsDailyComponent } from './saints-daily.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
	declarations: [
		SaintsDailyComponent
	],
	imports: [
		SharedModule,
		CarouselModule,
		MatProgressSpinnerModule
	],
	exports: [SaintsDailyComponent]
})
export class SaintsDailyModule { }
