import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-top-header',
	templateUrl: './top-header.component.html',
	styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent extends SimpleBaseComponent {

	public timeTitle: string = '';
	constructor(public sharedService: SharedPropertyService) {
		super(sharedService);
		let dateNow = this.sharedService.moment();
		this.timeTitle = `${this.getWeekDay(dateNow.format('dddd'))}, Ngày ${dateNow.format('DD')} tháng ${dateNow.format('MM')} năm ${dateNow.format('YYYY')}`;
	}

	ngOnInit(): void {
	}

	getWeekDay(key: string) {
		switch (key) {
			case 'Monday':
				return 'Thứ Hai';
			case 'Tuesday':
				return 'Thứ Ba';
			case 'Wednesday':
				return 'Thứ Tư';
			case 'Thursday':
				return 'Thứ Năm';
			case 'Friday':
				return 'Thứ Sáu';
			case 'Saturday':
				return 'Thứ Bảy';
			case 'Sunday':
				return 'Chúa Nhật';
		}
	}

}
