import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-main-banner',
	templateUrl: './main-banner.component.html',
	styleUrls: ['./main-banner.component.scss']
})
export class MainBannerComponent extends SimpleBaseComponent {

	public dataItems: any[] = [];
	constructor(public sharedService: SharedPropertyService,
		public service: SharedService
	) {
		super(sharedService);
		this.getPosts();
	}

	getPosts() {
		let options = {
			skip: 0,
			top: 5,
			sort: 'created desc'
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getPosts(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
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
