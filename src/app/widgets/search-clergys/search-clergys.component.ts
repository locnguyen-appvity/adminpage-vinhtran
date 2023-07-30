import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
	// public cacheDataLists: any = [];
	public loading: boolean = false;
	public positionList: any[] = [];

	constructor(public sharedService: SharedPropertyService,
		public linq: LinqService,
		private sanitizer: DomSanitizer,
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
		let restrictions = [
			// 	{
			// 	"key": "status",
			// 	"value": "duong_nhiem"
			// }
		];
		if (this.data) {
			if (this.data.groupID && this.data.groupID != 'all') {
				restrictions.push({
					"key": "GroupId",
					"value": this.data.groupID && this.data.groupID != 'all' ? this.data.groupID : ""
				})
			}
			if (this.data.position && this.data.position != 'all') {
				restrictions.push({
					"key": "Position",
					"value": this.data.position && this.data.position != 'all' ? this.data.position : "	"
				})
			}
			if (this.data.name) {
				restrictions.push({
					"key": "name",
					"value": this.data.name ? this.data.name : "	"
				})
			}
		}
		let options = {
			"page": 1,
			"pageSize": 100,
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
		// this.cacheDataLists = [];
		this.service.searchClergies(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.results && res.results.length > 0) {
					// this.cacheDataLists = res.data;
					this.dataLists = res.results//this.linq.Enumerable().From(res.data).Distinct('$.clergyID').ToArray();
					for (let item of this.dataLists) {
						item.id = item.clergyID;
						item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, "code");
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						else {
							item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_priest.svg');
						}
						item.name = `${this.sharedService.getClergyLevel(item)} ${item.stName} ${item.name}`;
						if (item.dateOfBirth) {
							item._dateOfBirth = this.sharedService.convertDateStringToMomentUTC_0(item.dateOfBirth);
							item.dateOfBirthView = this.sharedService.formatDate(item._dateOfBirth);
						}
						// item.clergyID = item.id;
						// this.getAppointments(item);
						item.appointment = {
							position: "Chưa cập nhật",
							entityName: "Chưa cập nhật"
						};
						item.stateGetAppointments = '';
						item.stateGetAnniversaries = '';
						item.anniversaries = [];
						// this.getAnniversaries(item);
					}
				}
				this.loading = false;
			}
		})
	}

	groupData(items: any) {
		return this.linq.Enumerable().From(items).GroupBy("$.name", null, (key: any, data: any) => {
			let _key = this.isNullOrEmpty(key) ? 'empty' : key;
			let dateOfBirthView = "";
			let pictureUrl = "../../assets/images/banner.jpg"
			if (data.source[0] && data.source[0].dateOfBirth) {
				let _dateOfBirth = this.sharedService.convertDateStringToMomentUTC_0(data.source[0].dateOfBirth);
				dateOfBirthView = this.sharedService.formatDate(_dateOfBirth);
			}
			if (data.source[0] && data.source[0].pictureUrl) {
				pictureUrl = data.source[0].pictureUrl
			}
			return {
				groupName: _key,
				pictureUrl: pictureUrl,
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

	// getAppointments(item: any) {
	// 	let options = {
	// 		filter: `clergyID eq ${item.clergyID} and status eq 'duong_nhiem'`
	// 	}
	// 	item.arrAppointments = [];
	// 	this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
	// 		if (res && res.value && res.value.length > 0) {
	// 			for (let item of res.value) {
	// 				item.order = this.sharedService.getOrderPositionClergy(item.position);
	// 				item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, 'code');
	// 			}
	// 			item.arrAppointments = this.linq.Enumerable().From(res.value).OrderBy("$.order").ToArray();
	// 		}
	// 	})
	// }

	// getAnniversaries(item: any) {
	// 	let options = {
	// 		filter: `entityID eq ${item.clergyID} and entityType eq 'clergy' and (type eq 'linh_muc' or type eq 'pho_te' or type eq 'giam_muc')`,
	// 		top: 1
	// 	}
	// 	item.anniversaries = [];
	// 	this.service.getAnniversaries(options).pipe(take(1)).subscribe((res: any) => {
	// 		if (res && res.value && res.value.length > 0) {
	// 			for(let it of res.value){
	// 				it._date = this.sharedService.convertDateStringToMomentUTC_0(it.date);
	// 				item.anniversaries.push({
	// 					name: it.name,
	// 					dateView: this.sharedService.formatDate(it._date)
	// 				})
	// 			}
	// 		}
	// 	})
	// }
}
