import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { SharedPropertyService } from '../shared-property.service';

@Directive({
	selector: '[updatePositionClergy]'
})
export class UpdatePositionClergyDirective implements OnChanges {

	@Input() itemPosition: any;
	@Input() positionList: any[] = [];
	@Output() onChanges: any = new EventEmitter();

	constructor(
		public sharedService: SharedPropertyService,
		public service: SharedService
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(!this.isNullOrEmpty(this.itemPosition) && this.positionList.length > 0){
			this.getAppointments(this.itemPosition);
		}
	}

	isNullOrEmpty(data: any) {
		if (data === null || data === "" || data === undefined) {
			return true;
		}
		return false;
	}

	getAppointments(item: any) {
		if (item.stateGetAppointments == 'loading' || item.stateGetAppointments == 'loaded' || this.isNullOrEmpty(item) || this.isNullOrEmpty(item.clergyID)) {
			return;
		}
		let options = {
			filter: `clergyID eq ${item.clergyID} and status eq 'duong_nhiem'`,
			sort: 'effectiveDate desc',
			top: 3
		}
		item.arrAppointments = [];
		item.stateGetAppointments = 'loading';
		this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			item.stateGetAppointments = 'loaded';
			if (res && res.value && res.value.length > 0) {
				let data = this.getPosition(res.value);
				if (data) {
					// for (let data of res.value) {
					// data.order = this.sharedService.getOrderPositionClergy(data.position);
					data.positionView = this.sharedService.getNameExistsInArray(data.position, this.positionList, 'code');
					// }
					item.appointment = {
						position: data.positionView,
						entityName: data.entityName
					};
				}
			}
		})
	}

	getPosition(items: any) {
		if (items && items.length > 0) {
			for (let item of items) {
				if (item.position == 'chanh_xu') {
					return item;
				}
			}
			for (let item of items) {
				if (item.position == 'pho_xu') {
					return item;
				}
			}
			return items[0];
		}
		return null;
	}

}