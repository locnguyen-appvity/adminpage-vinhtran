import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, debounceTime, distinctUntilChanged, forkJoin, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { CLERGY_STATUS, LEVEL_CLERGY } from 'src/app/shared/data-manage';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClergyInfoComponent } from '../clergy-info/clergy-info.component';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { CommonUtility } from 'src/app/shared/common.utility';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-clergys-list-grid',
	templateUrl: './clergys-list-grid.component.html',
	styleUrls: ['./clergys-list-grid.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class ClergiesListComponent extends TemplateGridApplicationComponent {

	public levelList: any[] = LEVEL_CLERGY;
	public positionList: any[] = [];
	public statusClergies: any[] = CLERGY_STATUS;
	public statusClergy: FormControl;
	public target: string = "";

	constructor(
		public sharedService: SharedPropertyService,
		public linq: LinqService,
		public router: Router,
		public service: SharedService,
		public dialog: MatDialog,
		public snackbar: MatSnackBar,
		private sanitizer: DomSanitizer,
		public store: Store<IAppState>
	) {
		super(sharedService, linq, store, service, snackbar);
		if (this.router.url.includes("tu_trieu")) {
			this.target = "tu_trieu";
		}
		else if (this.router.url.includes("tu_dong")) {
			this.target = "tu_dong";
		}
		else if (this.router.url.includes("giam_muc")) {
			this.target = "giam_muc";
		}
		this.statusClergy = new FormControl('all');
		this.statusClergy.valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), distinctUntilChanged(), takeUntil(this.unsubscribe)).subscribe(() => {
			this.getDataGridAndCounterApplications();
		});
		this.pageSize = 10;
		this.pageSizeOptions = [10, 25, 50];
		this.getPositions();
		this.getDataGridAndCounterApplications();
		this.getGroups(false);
	}

	getStatusDefault() {
		return [];
	}

	getCounterApplications(item: any) {
		return new Observable(obs => {
			let options = {
				top: 1,
				filter: this.getFilter(item.key),
				select: 'id'
			}
			this.service.getClergies(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					item.count = res.total || 0;
					obs.next(item);
					obs.complete();
				}
			})
		})
	}

	getGroups(isUpdateValue: boolean = true) {
		let options = {
			filter: "type eq 'giao_hat'"
		}
		this.service.getGroups(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					let items = res.value;
					let quickFilterStatus = [];
					let requests: Observable<any>[] = [];
					for (let item of items) {
						let data = {
							id: item.id,
							title: item.name,
							text: item.name,
							count: 0,
							key: item.id,
							code: item.id,
							icon: '',
							checked: false
						}
						if (isUpdateValue) {
							requests.push(this.getCounterApplications(data));
						}
						else {
							quickFilterStatus.push(data);
						}
					}
					let dataAll = {
						id: 'all',
						title: 'Tất Cả',
						text: 'Tất Cả',
						count: 0,
						key: 'total',
						code: 'total',
						icon: '',
						checked: true
					}
					if (isUpdateValue) {
						requests.unshift(this.getCounterApplications(dataAll));
						forkJoin(requests).pipe(take(1)).subscribe({
							next: (dataItems: any) => {
								if (isUpdateValue) {
									for (let item of this.quickFilterStatus) {
										let data = this.sharedService.getItemExistsInArray(item.id, dataItems, 'id');
										item.count = data.count;
									}
								}
							}
						})
					}
					else {
						quickFilterStatus.unshift(dataAll);
						this.quickFilterStatus = quickFilterStatus;
					}
				}
			}
		})
	}

	getDataGridAndCounterApplications() {
		this.getDataGridApplications();
		this.getGroups();
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
				this.getDataGridAndCounterApplications();
			}
		})
	}

	getDataGridApplications() {
		this.skip = this.currentPageIndex * this.pageSize;
		let options = {
			skip: this.skip,
			top: this.pageSize,
			filter: this.getFilter(),
			sort: 'firstName asc'
		}
		if (this.subscription['getClergies']) {
			this.subscription['getClergies'].unsubscribe();
		}
		this.dataProcessing = true;
		this.service.getClergies(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				this.dataProcessing = false;
				let total = res.total || 0;
				let items = [];
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.expandData = {
							anniversaries: [],
							appointments: []
						}
						item.disabledItem = false;
						item.fullName = `${this.sharedService.getClergyLevel(item)} ${item.stName}  ${item.name}`
						item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_priest.svg')
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
						}
						item.statusView = this.sharedService.getClergyStatus(item.status);
						item.statusClass = this.sharedService.getClergyStatusClass(item.status);
					}
				}
				this.gridDataChanges.data = items;
				this.gridDataChanges.total = total;
				this.gridMessages = this.displayGridMessage(total);
			}

		})
	}

	getFilter(groupID: string = "") {
		let filter = '';
		if (!this.isNullOrEmpty(this.target)) {
			let filterTarget = "";
			if (this.target == 'giam_muc') {
				filterTarget = "level eq 'giam_muc'";
			}
			else {
				filterTarget = `type eq '${this.target}' and level ne 'giam_muc'`;
			}
			if (this.isNullOrEmpty(filter)) {
				filter = filterTarget;
			}
			else {
				filter = `(${filter}) and (${filterTarget})`;
			}
		}
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(name), tolower('${quick}')) or contains(tolower(code), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		let filterStatus = "";
		if (!this.isNullOrEmpty(this.statusClergy.value) && this.statusClergy.value != 'all') {
			if (this.statusClergy.value == 'huu_duong') {
				filterStatus = "status eq 'huu_duong' or status eq 'huu' or status eq 'nghi_duong'"
			}
			else if (this.statusClergy.value == 'khac') {
				filterStatus = "status ne 'huu_duong' and status ne 'huu' and status ne 'nghi_duong' and status ne 'dang_phuc_vu' and status ne 'du_hoc' and status ne 'rip' and status ne 'hoi_tuc' and status ne 'chua_benh'"
			}
			else {
				filterStatus = `status eq '${this.statusClergy.value}'`
			}
		}
		if (!this.isNullOrEmpty(filterStatus)) {
			if (this.isNullOrEmpty(filter)) {
				filter = filterStatus;
			}
			else {
				filter = `(${filter}) and (${filterStatus})`;
			}
		}

		if (!this.isNullOrEmpty(groupID)) {
			if (groupID != 'total') {
				if (this.isNullOrEmpty(filter)) {
					filter = `groupID eq ${groupID}`;
				}
				else {
					filter = `(${filter}) and (groupID eq ${groupID})`;
				}
			}
		}
		else {
			if (!this.isNullOrEmpty(this.statusFilterControl.value) && this.statusFilterControl.value != 'total') {
				if (this.isNullOrEmpty(filter)) {
					filter = `groupID eq ${this.statusFilterControl.value}`;
				}
				else {
					filter = `(${filter}) and (groupID eq ${this.statusFilterControl.value})`;
				}
			}
		}
		return filter;
	}

	addItem() {
		let config: any = {};
		config.data = {
			type: 'add',
			target: this.target
		};
		this.openFormDialog(config, 'add');
	}

	onChangeData(item: any) {
		this.router.navigate([`/admin/manage/${this.target}/detail/${item.id}`]);
	}

	onViewDetail(item: any) {
		this.router.navigate([`/admin/clergy-view/${item.id}`]);
	}

	openFormDialog(config: any, type: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-m';
		config.maxWidth = '80vw';
		config.height = 'auto';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(ClergyInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res && res.action == 'save') {
					snackbarData.key = type === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = type === 'edit' ? 'Sửa Linh Mục Thành Công' : 'Thêm Linh Mục Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataGridAndCounterApplications();
				}
				else if (res && res.action == 'save-open-detail') {
					snackbarData.key = type === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = type === 'edit' ? 'Sửa Linh Mục Thành Công' : 'Thêm Linh Mục Thành Công';
					this.showInfoSnackbar(snackbarData);
					if (res.data && res.data.id) {
						this.onChangeData(res.data);
					}
					else {
						this.getDataGridAndCounterApplications();
					}
				}
				else if (res && res.delete == 'delete') {
					this.getDataGridAndCounterApplications();
				}
			}
		});
	}

	onDelete(item: any) {
		this.dataProcessing = true;
		this.service.deleteClergy(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			let snackbarData: any = {
				key: 'delete-item',
				message: 'Xóa Thành Công'
			};
			this.showInfoSnackbar(snackbarData);
			this.getDataGridAndCounterApplications();
		})
	}

	registerGridColumns() {
		this.displayColumns = ['id', 'photo', 'name', 'status', 'phoneNumber', 'email', 'fatherName', 'motherName', 'created', 'moreActions'];
	}

	toggleExpandElements(item: any) {
		if (item.stateLoadExpand == 'loading' || item.stateLoadExpand == 'loaded') {
			item._expand_detail = !item._expand_detail;
			return;
		}
		if (!this.isNullOrEmpty(item.id)) {
			let optionsAnniversaries = {
				filter: `entityID eq ${item.id} and entityType eq 'clergy'`,
				sort: 'date asc'
			}
			let optionsAppointments = {
				filter: `clergyID  eq ${item.id} and status eq 'duong_nhiem'`,
				sort: 'effectiveDate desc'
			}
			item.stateLoadExpand = 'loading'
			forkJoin({ anniversaries: this.service.getAnniversaries(optionsAnniversaries), appointments: this.service.getAppointments(optionsAppointments) }).pipe(take(1)).subscribe({
				next: (res: any) => {
					// this.handleDataItem(res);
					let anniversaries = [];
					if (res && res.anniversaries.value) {
						anniversaries = res.anniversaries.value;
						for (let it of anniversaries) {
							it.dateView = "Chưa cập nhật"
							if (it.type == 'saint') {
								it.dateView = `${it.description} (${it.day})`;
							}
							else {
								if (it.date) {
									it._date = this.sharedService.convertDateStringToMoment(it.date, this.offset);
									it.dateView = this.sharedService.formatDate(it._date);
								}
							}
						}
					}
					item.expandData.anniversaries = anniversaries;
					let appointments = [];
					if (res && res.appointments.value) {
						appointments = res.appointments.value;
						for (let it of appointments) {
							it.positionView = this.updatePosition(it.position);
							if(!this.isNullOrEmpty(it.entityType) && !this.isNullOrEmpty(it.entityID)){
								it.entitylink = `${location.origin}/gppc/client/page/${it.entityType}/${it.entityID}`;
							}
						}
						let data = CommonUtility.getCurrentPositionClergy(appointments);
						if (data) {
							item.appointment = {
								positionView: data.positionView,
								entityName: data.entityName,
								entitylink: data.entitylink

							}
							appointments = appointments.filter(it => it.id != data.id);
						}
					}
					item.expandData.appointments = appointments;
					item._expand_detail = !item._expand_detail;
					item.stateLoadExpand = 'loaded'

				}
			})
		}
		else {
			item.stateLoadExpand = 'loaded'
			item._expand_detail = !item._expand_detail;
		}
	}

	updatePosition(position: string) {
		if (!this.isNullOrEmpty(position)) {
			let poss = this.sharedService.getValueAutocomplete(position, this.positionList, 'code');
			if (poss && poss.name) {
				return poss.name;
			}
		}
		return 'Chưa xác định'
	}


}
