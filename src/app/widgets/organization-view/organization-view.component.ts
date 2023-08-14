import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { LinqService } from 'src/app/shared/linq.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { PageService } from 'src/app/page/page.service';

@Component({
	selector: 'app-organization-view',
	templateUrl: './organization-view.component.html',
	styleUrls: ['./organization-view.component.scss']
})
export class OrganizationViewComponent extends SimpleBaseComponent {
	public localItem: any;
	// public levelList: any[] = LEVEL_CLERGY;
	// public groupsList: any[] = [];
	public arrMasses: any[] = [];
	public churchsList: any[] = [];
	public arrAppointments: any[] = [];
	public arrAnniversaries: any[] = [];
	public positionList: any[] = [];
	public anniversaries: any = {};
	// public entityType: string = 'giao_xu';
	public filterAppointments: string = "status ne 'duong_nhiem'"
	public editorFormCtrl: FormControl;
	
	constructor(
		private service: PageService,
		public sharedService: SharedPropertyService,
		public linq: LinqService,
		public router: Router,
		private sanitizer: DomSanitizer,
		public activeRoute: ActivatedRoute
	) {
		super(sharedService);
		this.editorFormCtrl = new FormControl("");
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		// if (this.router.url.includes("giao_xu")) {
		// 	this.entityType = 'giao_xu';
		// }
		// else if (this.router.url.includes("giao_diem")) {
		// 	this.entityType = 'giao_diem';
		// }
		// else if (this.router.url.includes("giao_ho")) {
		// 	this.entityType = 'giao_ho';
		// }
		if (!this.isNullOrEmpty(this.ID)) {
			// if(this.entityType == 'organization'){
			this.getOrganization();
			this.getAnniversaries(this.ID, 'organization');
			this.getAppointments(this.ID, 'organization');
			// }
			// else {
			// 	this.getGroup();
			// }
		}
	}

	getAppointments(entityID: string, entityType: string) {
		let options = {
			sort: 'effectiveDate asc',
			filter: `entityID eq ${entityID} and entityType eq '${entityType}' and status eq 'duong_nhiem'`
		}
		this.arrAppointments = [];
		this.dataProcessing = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			if (res && res.value && res.value.length > 0) {
				this.arrAppointments = res.value;
			}
		})
	}

	getOrganization() {
		this.service.getOrganization(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem.groupTypeView = this.sharedService.updateNameTypeOrg(this.localItem.groupType);
					this.localItem.parentTypeView = this.sharedService.updateNameTypeOrg(this.localItem.parentType);
					this.editorFormCtrl.setValue(this.localItem.content);
					if(!this.isNullOrEmpty(this.localItem.population) && !this.isNullOrEmpty(this.localItem.memberCount)){
						this.localItem.memberCountPercent = `(~${(this.localItem.memberCount/this.localItem.population).toFixed(2)}%)`;
					}
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

	// getGroup() {
	// 	this.service.getGroup(this.ID).pipe(take(1)).subscribe({
	// 		next: (res: any) => {
	// 			if (res) {
	// 				this.localItem = res;
	// 				this.localItem.displayName = `${this.sharedService.updateNameTypeOrg(this.localItem.type)} ${this.localItem.name}`;
	// 				if (this.localItem.photo) {
	// 					this.localItem.pictureUrl = `${GlobalSettings.Settings.Server}/${this.localItem.photo}`;
	// 				}
	// 				else {
	// 					this.localItem.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg');
	// 				}
	// 			}
	// 		}
	// 	})
	// }

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
					if(key !== 'khac'){
						let dataItems = this.linq.Enumerable().From(itemValue[key]).OrderBy("$.order").ToArray();
						value.push({
							name: itemValue[key][0].name,
							data: dataItems.map(it => it.time ? it.time.replace(/\:00/, 'h').replace(/\:/, 'h') : "").join(", ")
						})
					}
					else {
						for(let it of itemValue[key]){
							value.push({
								name: it.name,
								data: it.time ? it.time.replace(/\:00/, 'h').replace(/\:/, 'h') : ""
							})
						}
					}
				}
			}
			item.arrMasseses = value;
		}
	}

}