import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { MatDialog } from '@angular/material/dialog';
import { LinqService } from 'src/app/shared/linq.service';

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
		public service: SharedService) {
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
		let options = {
			filter: this.getFilter()
		}
		this.dataLists = [];
		this.loading = true;
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						this.updateMassesesToOrg(item);
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						else {
							item.pictureUrl = "../../assets/icons/ic_church_24dp.svg"
						}
					}
				}
				this.dataLists = items;
				this.loading = false;
			}
		})
	}

	updateMassesesToOrg(item: any) {
		let options = {
			filter: `entityId eq ${item.id} and entityType eq 'organization'`
		}
		item.arrMasseses = [];
		this.service.getMasseses(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let masse of items) {
						let _time = masse.time ? masse.time.split(":")[0] : 0;
						masse._time = _time ? Number(_time) : 0;
					}
					items = this.linq.Enumerable().From(items).OrderBy("$._time").ToArray();
				}
				item._arrMasseses = items;
				this.handleMasseses(item);
			}
		})
	}

	handleMasseses(item: any) {
		let masses = item._arrMasseses;
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
						name: itemValue[key][0].name,
						data: dataItems.map(it => it.time ? it.time.replace(/\:00/, 'h').replace(/\:/, 'h') : "").join(", ")
					})
				}
				// else if(itemValue[key].length > 0) {

				// }
				console.log("value..........", value);
			}
			item.arrMasseses = value;
		}
	}
}
