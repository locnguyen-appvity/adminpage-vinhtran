import { AfterViewInit, Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { SharedPropertyService } from '../shared-property.service';
import { take } from 'rxjs';

@Directive({
	selector: '[updateAnniversariesClergy]'
})
export class UpdateAnniversariesClergyDirective implements OnChanges, AfterViewInit {

	@Input() itemAnniversaries: any;
	@Output() onChanges: any = new EventEmitter();

	constructor(
		public sharedService: SharedPropertyService,
		public service: SharedService
		) {
	}

	ngAfterViewInit(): void {
		this.getAnniversaries(this.itemAnniversaries);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(!this.isNullOrEmpty(this.itemAnniversaries)){
			this.getAnniversaries(this.itemAnniversaries);
		}
	}

	isNullOrEmpty(data: any) {
        if (data === null || data === "" || data === undefined) {
            return true;
        }
        return false;
    }

	getAnniversaries(item: any) {
		if(item.stateGetAnniversaries == 'loading' || item.stateGetAnniversaries == 'loaded' || this.isNullOrEmpty(item) || this.isNullOrEmpty(item.clergyID)){
			return;
		}
		let options = {
			filter: `entityID eq ${item.clergyID} and entityType eq 'clergy' and (type eq 'linh_muc' or type eq 'pho_te' or type eq 'giam_muc')`
		}
		item.stateGetAnniversaries = 'loading';
		this.service.getAnniversaries(options).pipe(take(1)).subscribe((res: any) => {
			item.stateGetAnniversaries = 'loaded';
			if (res && res.value && res.value.length > 0) {
				for(let it of res.value){
					it._date = this.sharedService.convertDateStringToMomentUTC_0(it.date);
					item.anniversaries.push({
						name: it.name,
						dateView: this.sharedService.formatDate(it._date)
					})
				}
			}
		})
	}

}