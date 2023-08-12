import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { LinqService } from 'src/app/shared/linq.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { PageService } from 'src/app/page/page.service';

@Component({
	selector: 'app-group-view',
	templateUrl: './group-view.component.html',
	styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent extends SimpleBaseComponent {
	public localItem: any;
	// public levelList: any[] = LEVEL_CLERGY;
	public groupsList: any[] = [];
	public arrMasses: any[] = [];
	public churchsList: any[] = [];
	public arrAppointments: any[] = [];
	public arrOrganizations: any[] = [];
	public arrAnniversaries: any[] = [];
	public positionList: any[] = [];
	public anniversaries: any = {};
	// public entityType: string = 'giao_xu';
	public configEditor:any = {
		"useSearch": false,
		"toolbar": false,
		"showCharsCounter": false,
		"showWordsCounter": false,
		"showXPathInStatusbar": false
	}
	public editorFormCtrl: FormControl;
	public filterAppointments: string = "position ne 'huu' and position ne 'nghi_duong' and position ne 'huu_duong' and status ne 'duong_nhiem'"

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
		// this.entityType = this.activeRoute.parent.snapshot.paramMap.get("type");
		if (!this.isNullOrEmpty(this.ID)) {
			this.getAnniversaries(this.ID, 'group');
			this.getAppointments(this.ID, 'group');
			this.getGroup();
		}
	}

	getOrganizations() {
		let options = {
			sort: 'name asc',
			filter: `groupID eq ${this.ID}`
		}
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value) {
					this.arrOrganizations = res.value;
					for(let item of this.arrOrganizations){
						item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
						item.link = `./#/page/${item.type}/${item.id}`
					}
				}
			}
		})
	}

	getGroup() { 
		forkJoin({group:this.service.getGroup(this.ID),analytics: this.service.getGroupAnalytics(this.ID) })
		.pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res.group;
					if(res.analytics && res.analytics.data){
						this.localItem.totalClergy = res.analytics.data.totalClergy;
						this.localItem.totalMemberCount = res.analytics.data.totalMemberCount;
						this.localItem.totalPopulation = res.analytics.data.totalPopulation;
						this.localItem.organizationAnalytics =  this.handleOrganizationAnalytics(res.analytics.data.organizationAnalytics);
					}
					this.localItem.displayName = `${this.sharedService.updateNameTypeOrg(this.localItem.type)} ${this.localItem.name}`;
					this.editorFormCtrl.setValue(this.localItem.content);
					if (this.localItem.photo) {
						this.localItem.pictureUrl = `${GlobalSettings.Settings.Server}/${this.localItem.photo}`;
					}
					else {
						this.localItem.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg');
					}
					this.getOrganizations();
				}
			}
		})
	}

	handleOrganizationAnalytics(items: any){
		if(items && items.length > 0){
			for(let item of items){
				item.order = this.sharedService.getOrderOrg(item.type);
				item.name = `Tổng số ${this.sharedService.updateTypeOrg(item.type)}`;
			}
			items = this.linq.Enumerable().From(items).OrderBy("$.order").ToArray();
		}
		return items;
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

	getAppointments(entityID: string, entityType: string) {
		let options = {
			sort: 'effectiveDate asc',
			filter: `entityID eq ${entityID} and entityType eq '${entityType}' and position ne 'huu' and position ne 'nghi_duong' and position ne 'huu_duong'`
		}
		this.arrAppointments = [];
		this.dataProcessing = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			console.log("arrAppointments........",res);
			
			if (res && res.value && res.value.length > 0) {
			
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