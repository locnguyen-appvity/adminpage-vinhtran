import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { SharedPropertyService } from '../shared-property.service';
import { CommonUtility } from '../common.utility';

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
				let data = CommonUtility.getCurrentPositionClergy(res.value);
				if (data) {
					// for (let data of res.value) {
					// data.order = this.sharedService.getOrderPositionClergy(data.position);
					data.positionView = this.sharedService.getNameExistsInArray(data.position, this.positionList, 'code');
					if(!this.isNullOrEmpty(data.entityType) && !this.isNullOrEmpty(data.entityID)){
						data.entitylink = `${location.origin}/client/page/${data.entityType}/${data.entityID}`;
					}
					// }
					item.appointment = {
						position: data.positionView,
						entityName: data.entityName,
						entitylink: data.entitylink

					};
				}
			}
		})
	}
}