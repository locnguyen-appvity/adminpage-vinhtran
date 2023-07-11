import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-favorite-posts',
	templateUrl: './favorite-posts.component.html',
	styleUrls: ['./favorite-posts.component.scss']
})
export class FavoritePostsComponent extends SimpleBaseComponent {

	public dataItems: any[] = [];
	constructor(public sharedService: SharedPropertyService,
		private service: SharedService) {
		super(sharedService);
		this.getContemplations();
	}

	getContemplations() {
		let options = {
			top: 6
		}
		this.service.getContemplations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						// this.getAvatar(item);
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
						}
					}
					this.dataProcessing = false;
				}
			}
		})
	}

}
