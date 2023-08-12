import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-clergies-appointment',
	templateUrl: './clergies-appointment.component.html',
	styleUrls: ['./clergies-appointment.component.scss']
})
export class ClergiesAppointmentComponent extends SimpleBaseComponent implements OnChanges {

	@Input() entityID: string;
	@Input() entityType: string;
	public arrAppointments: any[] = [];
	public positionList: any[] = [];
	constructor(
		public sharedService: SharedPropertyService,
		private service: SharedService,
		private sanitizer: DomSanitizer
	) {
		super(sharedService);
		this.getPositions();
	}

	getPositions() {
		// let options = {
		// 	filter: "type eq 'giao_xu'"
		// }
		this.positionList = [];
		this.service.getPositions().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionList = items;
				if(this.arrAppointments && this.arrAppointments.length > 0){
					for(let item of this.arrAppointments){
						item.positionView = this.updatePosition(item.position);
					}
				}
			}
		})
	}

	updatePosition(position: string) {
		if (!this.isNullOrEmpty(position)) {
			let poss = this.sharedService.getValueAutocomplete(position, this.positionList, 'code');
			if (poss && poss.name) {
				return poss.name;
			}
		}
		return 'Chưa xác định'
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType']) {
			if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityType)) {
				this.getAppointments(this.entityID,this.entityType);
			}

		}
	}

	getAppointments(entityID: string, entityType: string) {
		let options = {
			sort: 'effectiveDate asc',
			filter: `position ne 'huu' and position ne 'nghi_duong' and position ne 'huu_duong' and entityID eq ${entityID} and entityType eq '${entityType}' and status eq 'duong_nhiem'`
		}
		this.arrAppointments = [];
		this.dataProcessing = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			if (res && res.value && res.value.length > 0) {
				this.arrAppointments = res.value;
				for(let item of this.arrAppointments){
					item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_priest.svg')
					if (item.photo) {
						item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
					}
					item.positionView = this.updatePosition(item.position);
				}
			}
		})
	}

}
