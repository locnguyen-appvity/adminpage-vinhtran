import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class FavoritePostsComponent extends SimpleBaseComponent implements OnChanges {

	public dataItems: any[] = [];
	@Input() target: string = 'latest';
	@Input() type: string = 'post';
	@Input() title: string = '';
	@Input() entityID: string;
	@Input() entityType: string;

	constructor(public sharedService: SharedPropertyService,
		private service: SharedService) {
		super(sharedService);
		this.getContemplations();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['type']) {
			this.getDataItems();
		}
	}

	getDataItems(){
		if(this.type == 'post'){
			this.getPosts();
		}
		else if(this.type == 'contemplation') {
			this.getContemplations();
		}
	}

	getFilter(){
		let filter = "";
		if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityType)) {
			if (this.isNullOrEmpty(filter)) {
				filter = `${this.entityType} eq ${this.entityID}`;
			}
			else {
				filter = `(${filter}) and (${this.entityType} eq ${this.entityID})`;
			}
		}
		return filter;
	}

	getPosts() {
		let options = {
			skip: 0,
			top: 5,
			sort: 'created desc',
			filter: this.getFilter()
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

	getContemplations() {
		let options = {
			skip: 0,
			top: 5,
			sort: 'created desc'
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getContemplations(options).pipe(take(1)).subscribe({
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
