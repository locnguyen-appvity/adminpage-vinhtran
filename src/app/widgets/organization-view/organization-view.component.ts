import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { LinqService } from 'src/app/shared/linq.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-organization-view',
	templateUrl: './organization-view.component.html',
	styleUrls: ['./organization-view.component.scss']
})
export class OrganizationViewComponent extends SimpleBaseComponent implements OnInit {
	public localItem: any;
	// public levelList: any[] = LEVEL_CLERGY;
	public groupsList: any[] = [];
	public arrMasses: any[] = [];
	public churchsList: any[] = [];
	public arrAppointments: any[] = [];
	public arrAnniversaries: any[] = [];
	public positionList: any[] = [];
	public anniversaries: any = {};
	public entityType: string = 'giao_xu';

	constructor(
		private service: SharedService,
		public sharedService: SharedPropertyService,
		public linq: LinqService,
		public router: Router,
		private sanitizer: DomSanitizer,
		public activeRoute: ActivatedRoute
	) {
		super(sharedService);
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (this.router.url.includes("organization")) {
			this.entityType = 'organization';
		}
		else if (this.router.url.includes("group")) {
			this.entityType = 'group';
		}
		// else if (this.router.url.includes("giao_ho")) {
		// 	this.entityType = 'giao_ho';
		// }
		if (!this.isNullOrEmpty(this.ID)) {
			if(this.entityType == 'organization'){
				this.getOrganization();
				this.getAnniversaries(this.ID, this.entityType);
			}
			else {
				this.getGroup();
			}
		}
	}

	ngOnInit(): void {
		this.getAllData();
	}

	getAllData() {
		this.getGroups();
	}

	getGroups() {
		this.groupsList = [];
		let options = {
			select: 'id,name,type',
			filter: "type eq 'dong_tu'"
		}
		this.service.getGroups(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items.push(...res.value);
					for (let item of items) {
						item.name = `${this.sharedService.updateTypeOrg(item.type)} ${item.name}`
					}
				}
				this.groupsList = items;
			}
		})
	}

	getOrganization() {
		this.service.getOrganization(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.updateMassesesToOrg(this.localItem);
					this.localItem.displayName = `${this.sharedService.updateNameTypeOrg(this.localItem.type)} ${this.localItem.name}`;
					if (this.localItem.photo) {
						this.localItem.pictureUrl = `${GlobalSettings.Settings.Server}/${this.localItem.photo}`;
					}
					else {
						this.localItem.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg');
					}
				}
			}
		})
	}

	getGroup() {
		this.service.getGroup(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem.displayName = `${this.sharedService.updateNameTypeOrg(this.localItem.type)} ${this.localItem.name}`;
					if (this.localItem.photo) {
						this.localItem.pictureUrl = `${GlobalSettings.Settings.Server}/${this.localItem.photo}`;
					}
					else {
						this.localItem.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg');
					}
				}
			}
		})
	}

	getAnniversaries(entityID: string, entityType: string) {
		let options = {
			sort: 'date asc',
			filter: `entityID eq ${entityID} and entityType eq '${entityType}'`
		}
		this.arrAnniversaries = [];
		this.dataProcessing = true;
		this.service.getAnniversaries(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			if (res && res.value && res.value.length > 0) {
				for (let item of res.value) {
					item.dateView = "Chưa cập nhật";
					if (item.date) {
						item._date = this.sharedService.convertDateStringToMomentUTC_0(item.date);
						item.dateView = this.sharedService.formatDate(item._date);
					}
					if (this.isNullOrEmpty(item.locationName)) {
						item.locationName = "Chưa cập nhật";
					}
					// if ((item.type == 'pho_te' || item.type == 'linh_muc' || item.type == 'baptize' || item.type == 'confirmation') && !this.isNullOrEmpty(item.description)) {
					// 	item.descriptionView = `bới: ${item.description}`
					// }
					this.anniversaries[item.type] = item;
				}
				this.arrAnniversaries = res.value;
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
			}
			item.arrMasseses = value;
		}
	}

}