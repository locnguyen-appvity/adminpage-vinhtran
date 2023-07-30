import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-events-daily',
	templateUrl: './events-daily.component.html',
	styleUrls: ['./events-daily.component.scss']
})
export class EventsDailyComponent extends SimpleBaseComponent {

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

	constructor(
		public sharedService: SharedPropertyService,
		public service: SharedService,) {
		super(sharedService);
	}

	ngOnInit(): void {
		this.getParables();
	}

	getParables() {
		let options = {
			skip: 0,
			top: 3,
			sort: 'created desc',
			filter: `type eq 'loi_chua'`
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getParables(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						item.dayTilte = "Thứ Hai";
						item.dateView = "Ngày 12 tháng 07 năm 2023";
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
						}
					}
				}
				this.dataProcessing = false;
			}
		})
	}

	getData(event: any) {
		console.log("getData.......", event);

	}
}
