import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-guest-review',
	templateUrl: './guest-review.component.html',
	styleUrls: ['./guest-review.component.scss']
})
export class GuestReviewComponent extends SimpleBaseComponent {
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
			top: 5,
			sort: 'created desc',
			filter: `type eq 'tu_ngu_kinh_thanh'`
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getParables(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
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

}
