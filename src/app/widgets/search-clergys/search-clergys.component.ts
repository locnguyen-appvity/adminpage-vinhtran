import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { POSSITION } from 'src/app/shared/data-manage';
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
	public loading: boolean = false;

	constructor(public sharedService: SharedPropertyService,
		public service: SharedService) {
		super(sharedService);
	}

	ngOnInit(): void {

	}

	getClergies() {
		// let options = {
		// 	filter: "type eq 'giao_xu'"
		// }
		this.loading = true;
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
				this.loading = false;
			}
		})
	}
}
