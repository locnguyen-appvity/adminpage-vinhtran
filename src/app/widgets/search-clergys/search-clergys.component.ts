import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { PageService } from 'src/app/page/page.service';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { LinqService } from 'src/app/shared/linq.service';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-search-clergys',
	templateUrl: './search-clergys.component.html',
	styleUrls: ['./search-clergys.component.scss']
})
export class SearchClergysComponent extends SimpleBaseComponent implements OnChanges {
	@Input() type: string = 'list';//dialog
	@Input() target: string = 'giao_xu';
	@Input() title: string = '';
	@Input() data: any;

	public dataLists: any = [];
	public cacheDataLists: any = [];
	public loading: boolean = false;
	public positionList: any[] = [];

	constructor(public sharedService: SharedPropertyService,
		public linq: LinqService,
		public service: PageService) {
		super(sharedService);

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['data']) {
			if (this.data) {
				if (this.positionList.length > 0) {
					this.getClergies();
				}
				else {
					this.getPositions();
				}
			}
		}
	}

	getClergies() {
		let restrictions = [{
			"key": "status",
			"value": "duong_nhiem"
		}];
		if (this.data) {
			// if (this.data.groupID && this.data.groupID != 'all') {
			restrictions.push({
				"key": "GroupID",
				"value": this.data.groupID && this.data.groupID != 'all' ? this.data.groupID : ""
			})
			// }
			// if (this.data.position && this.data.position != 'all') {
			restrictions.push({
				"key": "position",
				"value": this.data.position && this.data.position != 'all' ? this.data.position : "	"
			})
			// }
		}
		let options = {
			"restrictions": restrictions,
			"sorts": [
				{
					"key": "name",
					"sortType": "asc"
				}
			]
		}
		this.loading = true;
		this.dataLists = [];
		this.cacheDataLists = [];
		this.service.searchClergies(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.data && res.data.length > 0) {
					this.cacheDataLists = res.data;
					for (let item of this.cacheDataLists) {
						item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, "code");
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						else {
							item.pictureUrl = "../../assets/images/banner.jpg"
						}
						this.getAppointments(item);
						this.getAnniversaries(item);
					}
				}
				this.dataLists = this.groupData(this.cacheDataLists);
				this.loading = false;
			}
		})
	}

	groupData(items: any) {
		return this.linq.Enumerable().From(items).GroupBy("$.name", null, (key: any, data: any) => {
			let _key = this.isNullOrEmpty(key) ? 'empty' : key;
			let dateOfBirthView = "";
			if (data.source[0] && data.source[0].dateOfBirth) {
				let _dateOfBirth = this.sharedService.convertDateStringToMomentUTC_0(data.source[0].dateOfBirth);
				dateOfBirthView = this.sharedService.formatDate(_dateOfBirth);
			}
			return {
				groupName: _key,
				pictureUrl: "../../assets/images/banner.jpg",
				dateOfBirthView: dateOfBirthView,
				controls: data.source,
			}
		}).OrderBy("$.name").ToArray();
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
				// for (let item of this.cacheDataLists) {
				// 	item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, "code");
				// }
				// this.dataLists = this.groupData(this.cacheDataLists);
				this.getClergies();
			}
		})
	}

	getAppointments(item: any) {
		let options = {
			filter: `clergyID eq ${item.clergyID} and status eq 'duong_nhiem'`
		}
		item.arrAppointments = [];
		this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			if (res && res.value && res.value.length > 0) {
				for (let item of res.value) {
					item.order = this.sharedService.getOrderPositionClergy(item.position);
					item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, 'code');
				}
				item.arrAppointments = this.linq.Enumerable().From(res.value).OrderBy("$.order").ToArray();
			}
		})
	}

	getAnniversaries(item: any) {
		let options = {
			sort: 'date asc',
			filter: `entityID eq ${item.clergyID} and entityType eq 'clergy' and (type eq 'pho_te' or type eq 'linh_muc' or type eq 'rip')`
		}
		item.arrAnniversaries = [];
		this.service.getAnniversaries(options).pipe(take(1)).subscribe((res: any) => {
			if (res && res.value && res.value.length > 0) {
				for (let item of res.value) {
					if (item.date) {
						item._date = this.sharedService.convertDateStringToMomentUTC_0(item.date);
						item.dateView = this.sharedService.formatDate(item._date);
					}
					
				}
				item.arrAnniversaries = res.value;
			}
		})
	}
}
