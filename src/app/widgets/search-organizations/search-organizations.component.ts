import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { MatDialog } from '@angular/material/dialog';
import { LinqService } from 'src/app/shared/linq.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PageService } from 'src/app/page/page.service';

@Component({
	selector: 'app-search-organizations',
	templateUrl: './search-organizations.component.html',
	styleUrls: ['./search-organizations.component.scss']
})
export class SearchOrganizationsComponent extends SimpleBaseComponent implements OnChanges, AfterViewInit {

	@Output() valueChange: EventEmitter<any> = new EventEmitter();

	@Input() data: any;
	@Input() title: string = '';
	@Input() loadDefeault: boolean = false;
	public dataLists: any = [];
	// public arrGroups: any[] = [];
	public loading: boolean = false;

	constructor(public sharedService: SharedPropertyService,
		public dialog: MatDialog,
		public linq: LinqService,
		private sanitizer: DomSanitizer,
		public service: PageService) {
		super(sharedService);
		// this.getGroups();
	}

	ngAfterViewInit(): void {
		if (this.loadDefeault) {
			this.getOrganizations();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['data']) {
			this.getOrganizations();
		}
	}

	onViewOrg(item: any) {
		window.open(`/#/page/organization/${item.id}`, '_blank');
	}
	// getGroups() {
	// 	let options = {
	// 		filter: "type eq 'giao_hat'"
	// 	}
	// 	this.dataLists = [];
	// 	this.service.getGroups(options).pipe(take(1)).subscribe({
	// 		next: (res: any) => {
	// 			let items = []
	// 			if (res && res.value && res.value.length > 0) {
	// 				items = res.value;
	// 			}
	// 			this.arrGroups = items;
	// 		}
	// 	})
	// }

	getFilter() {
		let filter = "type eq 'giao_xu' and status eq 'publish'";
		if (this.data) {
			if (this.data.groupID && this.data.groupID != 'all') {
				if (!this.isNullOrEmpty(filter)) {
					filter = `${filter} and groupID eq ${this.data.groupID}`
				}
				else {
					filter = `groupID eq ${this.data.groupID}`
				}
			}
			if (this.data.name) {
				if (!this.isNullOrEmpty(filter)) {
					filter = `${filter} and contains(tolower(name), tolower('${this.data.name}'))`
				}
				else {
					filter = `contains(tolower(name), tolower('${this.data.name}'))`
				}
			}
		}
		return filter;
	}

	getOrganizations() {
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
					"key": "name",
					"value": this.data.position && this.data.position != 'all' ? this.data.position : ""
				})
			}
			if (this.data.masses) {
				restrictions.push({
					"key": "masses",
					"value": this.data.masses ? this.data.masses : null
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
		this.service.searchOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.results && res.results.length > 0) {
					for (let item of res.results) {
						item.time = item.massTime;
						item.code = item.massCode;
						item.id = item.orgID;
						// this.updateMassesesToOrg(item);
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						else {
							item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg');
						}
					}
					items = this.linq.Enumerable().From(res.results).GroupBy("$.name", null, (key: any, data: any) => {
						let _key = this.isNullOrEmpty(key) ? 'empty' : key;
						let item = data.source[0];
						let items = data.source ? this.handleMasseses(data.source.filter(it => !this.isNullOrEmpty(it.time))) : [];
						return {
							id: item.orgID,
							pictureUrl: item.pictureUrl,
							name: _key,
							address: item ? item.address : "Chưa cập nhật",
							phoneNumber: item ? item.phoneNumber : "Chưa cập nhật",
							memberCount: item ? item.memberCount : "Chưa cập nhật",
							population: item ? item.population : "Chưa cập nhật",
							arrMasseses: this.handleMasses(items),
						}
					}).ToArray();
				}
				this.dataLists = items;
				this.loading = false;
			}
		})
		// let options = {
		// 	filter: this.getFilter()
		// }
		// this.dataLists = [];
		// this.loading = true;
		// this.service.getOrganizations(options).pipe(take(1)).subscribe({
		// 	next: (res: any) => {
		// 		let items = []
		// 		if (res && res.value && res.value.length > 0) {
		// 			items = res.value;
		// 			for (let item of items) {
		// 				this.updateMassesesToOrg(item);
		// 				if (item.photo) {
		// 					item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
		// 				}
		// 				else {
		// 					item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg');
		// 				}
		// 			}
		// 		}
		// 		this.dataLists = items;
		// 		this.loading = false;
		// 	}
		// })
	}

	updateMassesesToOrg(item: any) {
		if (this.isNullOrEmpty(item.id)) {
			return;
		}
		let options = {
			filter: `entityId eq ${item.id} and entityType eq 'organization'`
		}
		item.arrMasseses = [];
		this.service.getMasseses(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = this.handleMasseses(res.value);
				}
				item.arrMasseses = this.handleMasses(items);
			}
		})
	}

	handleMasseses(items: any) {
		if (items && items.length > 0) {
			for (let masse of items) {
				let _time = masse.time ? masse.time.split(":")[0] : 0;
				masse._time = _time ? Number(_time) : 0;
			}
			items = this.linq.Enumerable().From(items).OrderBy("$._time").ToArray();
		}
		return items;
	}

	handleMasses(masses: any) {
		if (masses && masses.length > 0) {
			let itemValue = {
				ngay_thuong: [],
				chieu_thu_bay: [],
				chua_nhat: [],
				khac: []
			}
			for (let masse of masses) {
				itemValue[masse.code].push(masse);
			}
			let value = [];
			for (let key in itemValue) {
				if (itemValue[key].length > 0) {
					let dataItems = this.linq.Enumerable().From(itemValue[key]).OrderBy("$.order").ToArray();
					value.push({
						name: itemValue[key][0].code,
						data: dataItems.map(it => it.time ? it.time.replace(/\:00/, 'h').replace(/\:/, 'h') : "").join(", ")
					})
				}
			}
			return value;
		}
		return [];
	}
}
