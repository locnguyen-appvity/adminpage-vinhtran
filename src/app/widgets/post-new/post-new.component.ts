import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-post-new',
	templateUrl: './post-new.component.html',
	styleUrls: ['./post-new.component.scss']
})
export class PostNewComponent extends SimpleBaseComponent {

	@Input() target: string = 'latest';
	@Input() type: string = 'post';
	@Input() entityID: string;
	@Input() entityType: string;

	public limit: number = 10;
	public customOptions: OwlOptions = {
		margin: 12,
		loop: true,
		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		dots: true,
		navSpeed: 700,
		navText: ['', ''],
		responsive: {
			0: {
				items: 1
			},
			400: {
				items: 2
			},
			740: {
				items: 3
			},
			940: {
				items: 6
			}
		},
		nav: false
	}
	public dataItems: any[] = [];
	constructor(public sharedService: SharedPropertyService,
		public service: SharedService
	) {
		super(sharedService);
		
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
