import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { LTYPE_ORG, STATUS_CLERGY } from 'src/app/shared/data-manage';
import { AppointmentsInfoComponent } from '../appointment-info/appointment-info.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { AppointmentAcceptComponent } from '../appointment-accept/appointment-accept.component';

@Component({
	selector: 'app-appointments-list',
	templateUrl: './appointments-list.component.html',
	styleUrls: ['./appointments-list.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class AppointmentsListComponent extends TemplateGridApplicationComponent implements OnChanges, AfterViewInit {

	@Input() entityID: string = '';
	public statusClergy: any[] = [];
	public positionList: any[] = [];
	public clergysList: any[] = [];
	public entityList: any[] = [];
	public entityListCache: any[] = [];
	public entityTypeList: any[] = [];
	public filterClergyID: FormControl;
	public filterEntityID: FormControl;
	public filterTypeEntityID: FormControl;
	public statusFilterControl: FormControl;
	public filterEntity: string = '';

	constructor(
		public sharedService: SharedPropertyService,
		public linq: LinqService,
		public router: Router,
		public service: SharedService,
		public dialog: MatDialog,
		public snackbar: MatSnackBar,
		public store: Store<IAppState>
	) {
		super(sharedService, linq, store, service, snackbar);
		this.pageSize = 25;
		this.entityTypeList.unshift({
			code: 'all',
			name: 'Tất Cả Loại Nơi Bổ Nhiệm'
		});
		this.entityTypeList.push(...LTYPE_ORG);
		this.statusClergy.unshift({
			code: 'total',
			name: 'Tất Cả Trạng Thái'
		})
		this.statusClergy.push(...STATUS_CLERGY);
		this.filterClergyID = new FormControl('all');
		this.filterClergyID.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.getDataGridAndCounterApplications();
		})
		this.filterTypeEntityID = new FormControl('all');
		this.filterTypeEntityID.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((type: any) => {
			if (type == 'all') {
				this.entityList = this.entityListCache;
			}
			else {
				this.entityList = this.entityListCache.filter(it => it.type == type);
				this.entityList.unshift({
					order: '1',
					groupName: "All",
					type: 'all',
					id: 'all',
					_id: 'all',
					name: `Tất cả ${this.sharedService.updateTypeOrg(type)}`
				})
			}
			this.filterClergyID.setValue('all');
		})
		this.filterEntityID = new FormControl('all');
		this.filterEntityID.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.getDataGridAndCounterApplications();
		})
		// this.filterStatus = new FormControl('all');
		// this.filterStatus.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
		// 	this.getDataGridAndCounterApplications();
		// })
		this.defaultSort = 'created desc';
		this.dataSettingsKey = 'user-list';
		this.getPositions();
		this.getClergies();
		this.getEntityList();
	}

	getStatusDefault() {
		let items = [];
		items.push({
			text: 'Tất cả',
			name: 'Tất cả',
			count: 0,
			key: 'total',
			icon: '',
			cssClass: 'all-widget',
			checked: true
		});
		items.push({
			text: 'Chờ Xác Nhận',
			name: 'Chờ Xác Nhận',
			count: 0,
			key: 'cho_xac_nhan',
			icon: '',
			cssClass: 'draft-widget',
			checked: false
		});
		items.push({
			text: 'Chờ Thuyên Chuyển',
			name: 'Chờ Thuyên Chuyển',
			count: 0,
			key: 'cho_thuyen_chuyen',
			icon: '',
			cssClass: 'pending-widget',
			checked: false
		});
		items.push({
			text: 'Đương Nhiệm',
			name: 'Đương Nhiệm',
			count: 0,
			key: 'duong_nhiem',
			icon: '',
			cssClass: 'approved-widget',
			checked: false
		});
		items.push({
			text: 'Mãn Nhiệm',
			name: 'Mãn Nhiệm',
			count: 0,
			key: 'man_nhiem',
			icon: '',
			cssClass: 'end-widget',
			checked: false
		});
		return items;
	}

	onSelectItem(event: any, target: string) {
		if (target == 'entityID') {
			this.filterEntity = "";
			if (event && event.id != 'all') {
				this.filterEntity = event.id;
			}
			this.getDataGridAndCounterApplications();
		}
	}

	getEntityList() {
		forkJoin({ organization: this.getOrganizations(), group: this.getGroups() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.organization && res.organization.length > 0) {
					items.push(...res.organization);
				}
				if (res && res.group && res.group.length > 0) {
					items.push(...res.group);
				}
				items.unshift({
					order: '1',
					groupName: "All",
					type: 'all',
					id: 'all',
					_id: 'all',
					name: 'Tất Cả Nơi Bổ Nhiệm'
				})
				this.entityListCache = items;
				this.entityList = items;
			}
		})
	}

	getOrganizations() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				// filter: this.getFilter(),
				// skip: 0,
				// top: 5
			}
			this.service.getOrganizations(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item._id = `organization_${item.id}`;
							item._type = 'organization';
							item.groupName = this.sharedService.updateTypeOrg(item.type);
							// item.order = this.sharedService.getOrderTypeOrg(item.type);
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
						}
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getGroups() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				// filter: this.getFilter(),
				// skip: 0,
				// top: 5
			}
			this.service.getGroups(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item._type = 'group';
							item._id = `group_${item.id}`;
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
							item.groupName = this.sharedService.updateTypeOrg(item.type);
						}
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getPositions() {
		let options = {
			sort: "status asc"
		}
		this.positionList = [];
		this.service.getPositions(options).pipe(take(1)).subscribe({
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

	getClergies() {
		this.clergysList = [];
		this.service.getClergies().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.name = `${this.sharedService.getClergyLevel(item)} ${item.stName} ${item.name}`;
					}
				}
				items.unshift({
					id: 'all',
					name: 'Tất Cả Linh Mục'
				})
				this.clergysList = items;
			}
		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID']) {
			this.getDataGridAndCounterApplications();
			this.registerGridColumns();
		}
	}

	getFilter(status: string) {
		let filter = '';
		if (!this.isNullOrEmpty(this.entityID)) {
			if (this.isNullOrEmpty(filter)) {
				filter = `entityID eq ${this.entityID}`;
			}
			else {
				filter = `(${filter}) and (entityID eq ${this.entityID})`;
			}
		}
		if (!this.isNullOrEmpty(this.filterEntity) && this.filterEntity != 'all') {
			if (this.isNullOrEmpty(filter)) {
				filter = `entityID eq  ${this.filterEntity}`;
			}
			else {
				filter = `(${filter}) and (entityID eq ${this.filterEntity})`;
			}
		}
		if (!this.isNullOrEmpty(status)) {
			if (status != 'total') {
				if (this.isNullOrEmpty(filter)) {
					filter = `status eq '${status}'`;
				}
				else {
					filter = `(${filter}) and (status eq '${status}')`;
				}
			}
		}
		else {
			if (!this.isNullOrEmpty(this.statusFilterControl.value) && this.statusFilterControl.value != 'total') {
				if (this.isNullOrEmpty(filter)) {
					filter = `status eq '${this.statusFilterControl.value}'`;
				}
				else {
					filter = `(${filter}) and (status eq '${this.filterClergyID.value}')`;
				}
			}
		}
		if (!this.isNullOrEmpty(this.filterClergyID.value) && this.filterClergyID.value != 'all') {
			if (this.isNullOrEmpty(filter)) {
				filter = `clergyID eq ${this.filterClergyID.value}`;
			}
			else {
				filter = `(${filter}) and (clergyID eq ${this.filterClergyID.value})`;
			}
		}
		if (!this.isNullOrEmpty(this.filterTypeEntityID.value) && this.filterTypeEntityID.value != 'all') {
			if (this.isNullOrEmpty(filter)) {
				filter = `entityType eq '${this.filterTypeEntityID.value}'`;
			}
			else {
				filter = `(${filter}) and (entityType eq '${this.filterTypeEntityID.value}')`;
			}
		}
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(clergyName), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}


	getDataGridAndCounterApplications() {
		this.getDataGridApplications();
		this.getCounterApplications();
	}

	getCounterApplications() {
		let keys = ["total", "cho_xac_nhan", "cho_thuyen_chuyen", "duong_nhiem", "man_nhiem"];
		let requests = {};
		for (let key of keys) {
			let options = {
				top: 1,
				filter: this.getFilter(key),
				select: 'id'
			}
			requests[key] = this.service.getAppointments(options)
		}
		forkJoin(requests).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					for (let it in res) {
						this.updateItemCount(it, res[it].total || 0);
					}
				}
			}
		})
	}

	updateItemCount(key: string, value: number) {
		for (let item of this.quickFilterStatus) {
			if (item.key == key) {
				item.count = value;
				return;
			}
		}
	}

	getDataGridApplications() {
		this.skip = this.currentPageIndex * this.pageSize;
		let options = {
			skip: this.skip,
			top: this.pageSize,
			filter: this.getFilter(""),
			sort: 'status asc, effectiveDate desc'
		}
		if (this.subscription['getAppointments']) {
			this.subscription['getAppointments'].unsubscribe();
		}
		this.dataProcessing = true;
		this.subscription['getAppointments'] = this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			let dataItems = [];
			let total = res.total || 0;
			if (res && res.value && res.value.length > 0) {
				dataItems = res.value;
				for (let item of dataItems) {
					item.disabledItem = false;
					item.readyLoadExpand = false;
					this.handleDataItem(item);
				}
			}
			this.gridDataChanges.data = dataItems;
			this.gridDataChanges.total = total;
			this.gridMessages = this.displayGridMessage(total);
			this.dataProcessing = false;
			if (this.subscription['getAppointments']) {
				this.subscription['getAppointments'].unsubscribe();
			}

		})
	}

	handleDataItem(item: any) {
		item.statusView = this.updateStatus(item);
		item.statusClass = this.sharedService.getClergyStatusClass(item.status);
		this.getPosition(item);
		if (item.created) {
			item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
			item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
		}
		if (item.effectiveDate) {
			item._effectiveDate = this.sharedService.convertDateStringToMoment(item.effectiveDate, this.offset);
			item.effectiveDateView = this.sharedService.formatDate(item._effectiveDate);
		}
		if (item.fromDate) {
			item._fromDate = this.sharedService.convertDateStringToMoment(item.fromDate, this.offset);
			item.fromDateView = this.sharedService.formatDate(item._fromDate);
		}
		if (item.toDate) {
			item._toDate = this.sharedService.convertDateStringToMoment(item.toDate, this.offset);
			item.toDateView = this.sharedService.formatDate(item._toDate);
		}
	}

	getPosition(item: any) {
		item.positionView = 'Chưa xác định'
		if (!this.isNullOrEmpty(item.position)) {
			let position = this.sharedService.getValueAutocomplete(item.position, this.positionList, 'code');
			if (position && position.name) {
				item.positionView = position.name;
			}
		}
	}

	updateStatus(item: any) {
		for (let status of this.statusClergy) {
			if (item.status == status.code) {
				return status.name;
			}
		}
		return "Không Xác Định";
	}

	openNewTab(element: any, target: string) {
		let link = '';
		if (target == 'clergy') {
			link = `./#/admin/clergy-view/${element.clergyID}`;
		}
		else {
			link = `./#/page/${element.entityType}/${element.entityID}`;
		}
		// this.router.navigate([]).then(() => {
		window.open(link, '_blank');
		// });
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status,
		}
		this.service.updateAppointment(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'activate-item',
					message: 'Hiện Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataGridApplications();
			}
		})
	}

	addItem(item?: any) {
		// let requets: Observable<any>[] = [];
		// for (let app of this.gridDataChanges.data) {
		// 	if (!this.isNullOrEmpty(app.entityType)) {
		// 		let entityType = '';
		// 		if (app.entityType == 'giao_xu' || app.entityType == 'giao_diem' || app.entityType == 'giao_ho' || app.entityType == 'organization') {
		// 			entityType = 'organization';
		// 		}
		// 		else {
		// 			entityType = 'group';
		// 		}
		// 		let options = {
		// 			entityType: entityType
		// 		}
		// 		requets.push(this.service.updateAppointment(app.id,options));
		// 	}
		// }
		// forkJoin(requets).pipe(take(1)).subscribe({
		// 	next:(res:any)=>{
		// 		console.log("update.......",res.length);

		// 	}
		// })
		let config: any = {
			data: {
				target: 'new',
				clergyID: item ? item.clergyID : ''
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = false;
		let dialogRef = this.dialog.open(AppointmentsInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = 'new-item';
					snackbarData.message = 'Thêm Giáo Xứ Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataGridApplications();
				}
			}
		});
	}

	getRowSelected(item: any, action: string) {
		if (action == 'auto') {
			let requets: any = {};

			if (!this.isNullOrEmpty(item.clergyID)) {
				let optionsClergy = {
					select: 'name,level,stName'
				}
				requets.clergy = this.service.getClergy(item.clergyID, optionsClergy);
			}
			if (!this.isNullOrEmpty(item.entityID)) {
				let options = {
					select: 'name,type'
				}
				if (this.sharedService.getTypeGetData(item.entityType) == 'organization') {
					requets.entity = this.service.getOrganization(item.entityID, options);
				}
				else {
					requets.entity = this.service.getGroup(item.entityID, options);
				}
			}
			if (Object.keys(requets).length > 0) {
				forkJoin(requets).pipe(takeUntil(this.unsubscribe)).subscribe({
					next: (res: any) => {
						let appointmentJSON: any = {}
						if (res.clergy) {
							appointmentJSON.clergyName = `${this.sharedService.getClergyLevel(res.clergy)} ${res.clergy.stName} ${res.clergy.name}`;
						}
						if (res.entity) {
							appointmentJSON.entityName = `${this.sharedService.updateNameTypeOrg(res.entity.type)} ${res.entity.name}`;
						}
						this.service.updateAppointment(item.id, appointmentJSON).pipe(take(1)).subscribe({
							next: () => {
								let snackbarData: any = {
									key: 'saved-item',
									message: 'Cập Nhật Bổ Nhiệm Thành Công'
								};
								this.showInfoSnackbar(snackbarData);
								this.getDataGridAndCounterApplications();
							}
						})
					}
				})
			}
		}
		else {
			if (this.isNullOrEmpty(this.entityID)) {
				let config: any = {
					data: {
						target: 'edit',
						// entityID: item.entityID,
						// entityName: item.entityName,
						// entityType: item.entityType,
						item: item,
						clergyID: item.clergyID,
						clergyName: item.clergyName,
						action: action
					}
				};
				config.disableClose = true;
				config.panelClass = 'dialog-form-l';
				config.maxWidth = '80vw';
				config.autoFocus = false;
				let dialogRef = this.dialog.open(AppointmentsInfoComponent, config);
				dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
					next: (res: any) => {
						let snackbarData: any = {
							key: ''
						};
						if (res === 'OK') {
							snackbarData.key = 'new-item';
							snackbarData.message = 'Thêm Bổ Nhiệm Thành Công';
							this.showInfoSnackbar(snackbarData);
							this.getDataGridAndCounterApplications();
						}
					}
				});
			}
		}
	}

	onAccept(item: any) {
		let config: any = {
			data: {
				target: 'edit',
				item: item,
				clergyID: item.clergyID,
				clergyName: item.clergyName
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = false;
		let dialogRef = this.dialog.open(AppointmentAcceptComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = 'new-item';
					snackbarData.message = 'Thêm Bổ Nhiệm Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataGridAndCounterApplications();
				}
			}
		});
	}

	onDelete(item: any) {
		this.dataProcessing = true;
		this.service.deleteAppointment(item.id).pipe(take(1)).subscribe(() => {
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
		if (!this.isNullOrEmpty(this.entityID)) {
			this.displayColumns = ['id', 'clergyName', 'entityName', 'position', 'status', 'appointerName', 'effectiveDate', 'created'];
		}
		else {
			this.displayColumns = ['id', 'clergyName', 'entityName', 'position', 'status', 'appointerName', 'effectiveDate', 'created', 'moreActions'];
		}
	}

	toggleExpandElements(item: any) {
		if (item.readyLoadExpand) {
			item._expand_detail = !item._expand_detail;
			return;
		}
		if (!this.isNullOrEmpty(item.fromAppointmentID)) {
			this.service.getAppointment(item.fromAppointmentID).pipe(take(1)).subscribe({
				next: (res: any) => {
					this.handleDataItem(res);
					item.readyLoadExpand = true;
					item.expandData = res;
					item._expand_detail = !item._expand_detail;

				}
			})
		}
		else {
			item.readyLoadExpand = true;
			item._expand_detail = !item._expand_detail;
		}
	}


}
