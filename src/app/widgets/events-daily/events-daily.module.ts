import { NgModule } from '@angular/core';
import { EventsDailyComponent } from './events-daily.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
	declarations: [
		EventsDailyComponent
	],
	imports: [
		SharedModule,
		CarouselModule
	],
	exports: [EventsDailyComponent]
})
export class EventsDailyModule { }
