import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-notifications-list',
	templateUrl: './notifications-list.component.html',
	styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent extends SimpleBaseComponent {

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
			top: 6,
			sort: 'created desc',
			select:'id,title,photo,created'
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
