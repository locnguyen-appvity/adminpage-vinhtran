import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-list-appointments-organization',
	templateUrl: './list-appointments-organization.component.html',
	styleUrls: ['./list-appointments-organization.component.scss']
})
export class ListAppointmentsOrganizationComponent extends SimpleBaseComponent implements OnChanges {

	@Output() onToggle: any = new EventEmitter();
	@Input() entityID: string;
	@Input() entityType: string;
	public positionList: any[] = [];
	public arrData:any[] = [];
	public activity: any[] = [];
	public arrDataInMyChurch: any[] = [];
	public toggleNotification: boolean = false;

	constructor(public override sharedService: SharedPropertyService, public router: Router,
		private service: SharedService,
		public linq: LinqService,
	) {
		super(sharedService);
		this.getPositions();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType']) {
			this.getDataItems();
		}
	}

	getPositions() {
		let options = {
			select: "id,name,code,slot,level",
			filter: "status ne 'inactive'"
		}
		this.positionList = [];
		this.service.getPositions(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionList = items;
				if(this.arrData && this.arrData.length > 0){
					for (let item of this.arrData) {
						item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, 'code');
					}
					this.activity = this.groupData(this.arrData);
				}
			}
		})
	}

	groupData(items: any) {
		return this.linq.Enumerable().From(items).GroupBy("$.groupName", null, (key: any, data: any) => {
			let _key = this.isNullOrEmpty(key) ? 'empty' : key;
			return {
				groupName: _key,
				data: data.source,
			}
		}).ToArray();
	}

	getDataItems() {
		let filter = '';
		if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityType)) {
			filter = `entityID eq ${this.entityID} and entityType eq '${this.entityType}'`;
		}
		else {
			return;
		}
		let options = {
			filter: filter,
			sort: 'effectiveDate desc'
		}
		this.arrData = [];
		this.dataProcessing = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.arrData = res.value;
					for (let item of this.arrData) {
						item.statusView = this.sharedService.getClergyStatus(item.status) ;
						item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, 'code');
						if (item && item.fromDate) {
							item._fromDate = this.sharedService.convertDateStringToMomentUTC_0(item.fromDate);
							item.fromDateView = this.sharedService.formatDate(item._fromDate);
							item.groupName = item._fromDate.format('YYYY');
						}
						if (item && item.toDate) {
							item._toDate = this.sharedService.convertDateStringToMomentUTC_0(item.toDate);
							item.toDateView = this.sharedService.formatDate(item._toDate);
						}
						if (item && item.effectiveDate) {
							item._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(item.effectiveDate);
							item.effectiveDateView = this.sharedService.formatDate(item._effectiveDate);
						}
					}
				}
				this.dataProcessing = false;
				this.activity = this.groupData(this.arrData);
			}
		})
	}

}
