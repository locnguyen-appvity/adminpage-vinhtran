import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, take } from 'rxjs';
import { PageService } from 'src/app/page/page.service';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-saints-daily',
	templateUrl: './saints-daily.component.html',
	styleUrls: ['./saints-daily.component.scss'],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppCustomDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: CUSTOM_DATE_FORMATS
		}
	]
})
export class SaintsDailyComponent extends SimpleBaseComponent {

	// public carouselSlide: any;
	// @ViewChild('carouselSlide') set elemOnHTML(elemOnHTML: any) {
	// 	if (!!elemOnHTML) {
	// 		this.carouselSlide = elemOnHTML;
	// 	}
	// }
	public dateControl: FormControl;
	public dataItems: any = [];
	public limit: number = 10;
	public customOptions: OwlOptions = {
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: false,
		center: true,
		navSpeed: 700,
		navText: ['<', '>'],
		responsive: {
			0: {
				items: 1
			},
			400: {
				items: 1
			},
			740: {
				items: 1
			},
			940: {
				items: 1
			}
		},
		nav: true
	}

	public spinnerLoading: boolean = false;
	public imgSaintText: any = "";
	public dateNowView: any = "";

	constructor(
		public sharedService: SharedPropertyService,
		private sanitizer: DomSanitizer,
		public service: PageService,) {
		super(sharedService);
		this.imgSaintText = this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/saint-text.png');
		this.spinnerLoading = true;
		this.dateNowView = `Ngày ${this.sharedService.formatDate(this.sharedService.moment())}`;
		this.getSaintDaily().pipe(take(1)).subscribe({
			next: (items: any) => {
				this.dataItems = items;
				this.spinnerLoading = false;
			}
		})
	}

	getSaintDaily() {
		return new Observable(obs => {
			let options = {
				filter: `anniversary eq '${this.sharedService.moment().format("DD/MM")}'`
			};
			this.service.getSaints(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items;
					if (res && res.value && res.value.length > 0) {
						items = res.value;
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}
}
