import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-posts-related',
	templateUrl: './posts-related.component.html',
	styleUrls: ['./posts-related.component.scss']
})
export class PostsRelatedComponent extends SimpleBaseComponent implements OnChanges {
	@Input() type: string = 'post';//dialog
	@Input() target: string = 'date';
	@Input() entityData: string;
	public dataPrevious: any = {
		title: "Thứ Ba Tuần XIV Mùa Thường Niên",
		imageUrl: this.imageUrl

	};
	public dataNext: any = {
		title: "Chúa Nhật Tuần XIV Mùa Thường Niên Năm A",
		imageUrl: this.imageUrl

	};;
	public loading: boolean = false;

	constructor(public sharedService: SharedPropertyService,
		private sanitizer: DomSanitizer,
		public service: SharedService) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['type'] || changes['target'] || changes['entityData']) {
			// if (!this.isNullOrEmpty(this.entityData)) {
				this.getDataItems();
			// }

		}
	}

	getDataItems() {
		if (this.type == 'contemplation') {
			this.getContemplations();
		}
		else if(this.type == 'post'){
			this.getPosts();
		}
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.entityData)) {
			let filterContent = '';
			if (this.target == 'date') {
				let entityData = this.sharedService.convertDateStringToMomentUTC_0(this.entityData);
				filterContent = `(created ge ${this.sharedService.ISOStartDay(entityData.clone().subtract(1, 'd'))} and created le ${this.sharedService.ISOEndDay(entityData.clone().subtract(1, 'd'))})`
			}
			if (!this.isNullOrEmpty(filterContent)) {
				if (this.isNullOrEmpty(filter)) {
					filter = filterContent;
				}
				else {
					filter = "(" + filter + ")" + " and (" + filterContent + ")";
				}
			}
		}
		return filter;
	}

	getContemplations() {
		let options = {
			// filter: this.getFilter(),
			sort: 'created desc',
			top: 2
		}
		this.service.getContemplations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					for (let item of res.value) {
						item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_image_48dp.svg');
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
					}
					this.dataNext = res.value[0] ? res.value[0] : null;
					this.dataPrevious = res.value[1] ? res.value[1] : null;
					// if (!this.isNullOrEmpty(this.entityData)) {
					// 	if (this.target == 'date') {
					// 		let entityData = this.sharedService.convertDateStringToMomentUTC_0(this.entityData);
					// 		this.dataPrevious = this.getExistItemInArray(this.sharedService.ISOStartDay(entityData.subtract(1, 'd')), res.value, 'eventDate');
					// 		this.dataNext = this.getExistItemInArray(this.sharedService.ISOStartDay(entityData.add(1, 'd')), res.value, 'eventDate');
					// 	}
					// }
				}
			}
		})
	}

	getPosts() {
		let options = {
			// filter: this.getFilter(),
			sort: 'created desc',
			top: 2
		}
		this.service.getPosts(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					for (let item of res.value) {
						item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_image_48dp.svg');
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
					}
					this.dataNext = res.value[0] ? res.value[0] : null;
					this.dataPrevious = res.value[1] ? res.value[1] : null;
					// if (!this.isNullOrEmpty(this.entityData)) {
					// 	if (this.target == 'date') {
					// 		let entityData = this.sharedService.convertDateStringToMomentUTC_0(this.entityData);
					// 		this.dataPrevious = this.getExistItemInArray(this.sharedService.ISOStartDay(entityData.subtract(1, 'd')), res.value, 'eventDate');
					// 		this.dataNext = this.getExistItemInArray(this.sharedService.ISOStartDay(entityData.add(1, 'd')), res.value, 'eventDate');
					// 	}
					// }
				}
			}
		})
	}

	getExistItemInArray(value: any, data: any, key: string = "id") {
		if (!this.isNullOrEmpty(value)) {
			if (data && data.length > 0) {
				for (let item of data) {
					if (item[key] == value) {
						return item;
					}
				}
			}
		}
		return null;
	}

}
