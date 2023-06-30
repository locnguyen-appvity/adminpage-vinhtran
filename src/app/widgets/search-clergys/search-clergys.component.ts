import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-search-clergys',
	templateUrl: './search-clergys.component.html',
	styleUrls: ['./search-clergys.component.scss']
})
export class SearchClergysComponent extends SimpleBaseComponent implements OnInit {
	@Input() type: string = 'list';//dialog
	@Input() target: string = 'giao_xu';
	@Input() title: string = '';
	public dataLists: any = [];

	constructor(public sharedService: SharedPropertyService,
		public service: SharedService) {
		super(sharedService);

	}

	ngOnInit(): void {

	}

	getOrganizations() {
		// let options = {
		// 	filter: "type eq 'giao_xu'"
		// }
		this.dataLists = [];
		this.service.getClergies().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						else {
							item.pictureUrl = "../../assets/images/banner.jpg"
						}
					}
				}
				this.dataLists = items;
			}
		})
	}
}