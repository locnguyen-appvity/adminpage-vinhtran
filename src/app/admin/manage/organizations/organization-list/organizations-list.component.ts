import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { OrganizationInfoComponent } from '../organization-info/organization-info.component';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { GlobalSettings } from 'src/app/shared/global.settings';

@Component({
	selector: 'app-organizations-list',
	templateUrl: './organizations-list.component.html',
	styleUrls: ['./organizations-list.component.scss']
})
export class OrganizationsListComponent extends TemplateGridApplicationComponent implements OnChanges, AfterViewInit {

	@Input() groupID: string = '';
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
		this.defaultSort = 'created desc';
		this.dataSettingsKey = 'user-list';
		this.getDataGridAndCounterApplications();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['groupID']) {
			this.getDataGridAndCounterApplications();
			this.registerGridColumns();
		}
	}

	getFilter() {
		let filter = '';
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
			let quickSearch = `contains(tolower(name), tolower('${quick}'))`;
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
	}

	getDataGridApplications() {
		let options = {
			filter: this.getFilter()
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
					this.updateStatus(item);
				}
			}
			this.gridDataChanges.data = dataItems;
			this.gridDataChanges.total = total;
			this.gridMessages = this.sharedService.displayGridMessage(this.gridDataChanges.total);
			this.dataProcessing = false;
			if (this.subscription['getOrganizations']) {
				this.subscription['getOrganizations'].unsubscribe();
			}

		})
	}

	onDeactive(item: any) {
		let dataJSON = {
			status: 'inactive',
		}
		this.service.updateOrganization(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'inactivate-item',
					message: 'Ẩn Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataGridApplications();
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
				this.getDataGridApplications();
			}
		})
	}

	addItem() {
		let config: any = {
			data: {
				target: 'new',
				groupID: this.groupID
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
					this.getDataGridApplications();
				}
			}
		});
	}

	getRowSelected(item: any) {
		if (this.isNullOrEmpty(this.groupID)) {
			this.router.navigate([`/admin/manage/organizations/organization/${item.id}`]);
		}
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
			this.getDataGridApplications();
		})
	}

	registerGridColumns() {
		if (!this.isNullOrEmpty(this.groupID)) {
			this.displayColumns = ['id', 'photo', 'status', 'name', 'email', 'phoneNumber', 'memberCount', 'population', 'created'];
		}
		else {
			this.displayColumns = ['id', 'photo', 'status', 'name', 'email', 'phoneNumber', 'memberCount', 'population', 'created', 'moreActions'];
		}
	}


}
