import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { OrganizationInfoComponent } from '../organization-info/organization-info.component';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-organizations-list',
	templateUrl: './organizations-list.component.html',
	styleUrls: ['./organizations-list.component.scss']
})
export class OrganizationsListComponent extends TemplateGridApplicationComponent implements OnChanges, AfterViewInit {

	// @ViewChild('widgetScroll', { static: true }) public widgetScroll: ElementRef<any>;
	@Input() groupID: string = '';
	public type: string = 'giao_xu';
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
		this.defaultSort = 'created desc';
		this.dataSettingsKey = 'user-list';
		if (this.router.url.includes("giao_diem")) {
			this.type = 'giao_diem';
		}
		else if (this.router.url.includes("giao_ho")) {
			this.type = 'giao_ho';

		}
		this.getDataGridAndCounterApplications();
		if(this.isNullOrEmpty(this.groupID)){
			this.getGroups(false);
		}
	}

	getStatusDefault() {
		return [];
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['groupID']) {
			this.getDataGridAndCounterApplications();
			this.registerGridColumns();
		}
	}

	getFilter(groupID: string = "") {
		let filter = `type eq '${this.type}'`;
		if (!this.isNullOrEmpty(this.groupID)) {
			if (this.isNullOrEmpty(filter)) {
				filter = `groupID eq ${this.groupID}`;
			}
			else {
				filter = `(${filter}) and (groupID eq ${this.groupID})`;
			}
		}
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(name), tolower('${quick}')) or contains(tolower(latin), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		if (!this.isNullOrEmpty(groupID)) {
			if (!this.isNullOrEmpty(groupID) && groupID !== 'total') {
				if (this.isNullOrEmpty(filter)) {
					filter = `groupID eq ${groupID}`;
				}
				else {
					filter = `(${filter}) and (groupID eq ${groupID})`;
				}
			}
		}
		else {
			if (!this.isNullOrEmpty(this.statusFilterControl.value) && this.statusFilterControl.value !== 'total') {
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


	getDataGridAndCounterApplications() {
		this.getDataGridApplications();
		if(this.isNullOrEmpty(this.groupID)){
			this.getGroups();
		}
	}

	getDataGridApplications() {
		this.skip = this.currentPageIndex * this.pageSize;
		let options = {
			filter: this.getFilter(),
			sort: 'created desc',
			skip: this.skip,
			top: this.pageSize
		}
		if (this.subscription['getOrganizations']) {
			this.subscription['getOrganizations'].unsubscribe();
		}
		this.dataProcessing = true;
		this.subscription['getOrganizations'] = this.service.getOrganizations(options).pipe(take(1)).subscribe((res: any) => {
			let dataItems = [];
			let total = res.total || 0;
			if (res && res.value && res.value.length > 0) {
				dataItems = res.value;
				for (let item of dataItems) {
					item.disabledItem = false;
					item.title = item.name;
					if (item.photo) {
						item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
					}
					else {
						item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg');
					}
					this.updateStatus(item);
					item.typeView = this.sharedService.updateTypeOrg(item.type);
				}
			}
			this.gridDataChanges.data = dataItems;
			this.gridDataChanges.total = total;
			this.gridMessages = this.displayGridMessage(total);
			this.dataProcessing = false;
			if (this.subscription['getOrganizations']) {
				this.subscription['getOrganizations'].unsubscribe();
			}

		})
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status,
		}
		this.service.updateOrganization(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'activate-item',
					message: 'Hiện Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataGridAndCounterApplications();
			}
		})
	}

	addItem() {
		let config: any = {
			data: {
				target: 'new',
				groupID: this.groupID,
				type: this.type
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(OrganizationInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = 'new-item';
					snackbarData.message = 'Thêm Giáo Xứ Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataGridAndCounterApplications();
				}
			}
		});
	}

	getRowSelected(item: any) {
		if (this.isNullOrEmpty(this.groupID)) {
			this.router.navigate([`/admin/manage/${item.type}/detail/${item.id}`]);
		}
	}

	onView(item: any){
		this.router.navigate([`/page/organization/${item.id}`]);
	}

	onDelete(item: any) {
		this.dataProcessing = true;
		this.service.deleteOrganization(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			let snackbarData: any = {
				key: 'delete-item',
				message: 'Xóa Thành Công'
			};
			this.showInfoSnackbar(snackbarData);
			this.getDataGridAndCounterApplications();
		})
	}

	getCounterApplications(item: any) {
		return new Observable(obs => {
			let options = {
				filter: this.getFilter(item.key),
				top: 1,
				select: "id"
			}
			this.service.getOrganizations(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					item.count = res.total || 0
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

	registerGridColumns() {
		if (!this.isNullOrEmpty(this.groupID)) {
			this.displayColumns = ['id', 'photo', 'status', 'type', 'name', 'email', 'phoneNumber', 'memberCount', 'population', 'created'];
		}
		else {
			this.displayColumns = ['id', 'photo', 'status', 'type', 'name', 'email', 'phoneNumber', 'memberCount', 'population', 'created', 'moreActions'];
		}
	}


}
