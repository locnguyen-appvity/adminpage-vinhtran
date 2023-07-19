import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { STATUS_CLERGY } from 'src/app/shared/data-manage';
import { AppointmentsInfoComponent } from '../appointment-info/appointment-info.component';

@Component({
	selector: 'app-appointments-list',
	templateUrl: './appointments-list.component.html',
	styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent extends TemplateGridApplicationComponent implements OnChanges, AfterViewInit {

	@Input() entityID: string = '';
	public statusClergy: any[] = STATUS_CLERGY;
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
		if (changes['entityID']) {
			this.getDataGridAndCounterApplications();
			this.registerGridColumns();
		}
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.entityID)) {
			if (this.isNullOrEmpty(filter)) {
				filter = `entityID eq ${this.entityID}`;
			}
			else {
				filter = `(${filter}) and (entityID eq ${this.entityID})`;
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
					item.statusView = this.updateStatus(item);
					if (item.created) {
						item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
						item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
					}
					if (item.effectiveDate) {
						item._effectiveDate = this.sharedService.convertDateStringToMoment(item.effectiveDate, this.offset);
						item.effectiveDateView = item._effectiveDate.format('DD/MM/YYYY hh:mm A');
					}
					if (item.fromDate) {
						item._fromDate = this.sharedService.convertDateStringToMoment(item.fromDate, this.offset);
						item.fromDateView = item._fromDate.format('DD/MM/YYYY hh:mm A');
					}
					if (item.toDate) {
						item._toDate = this.sharedService.convertDateStringToMoment(item.toDate, this.offset);
						item.toDateView = item._toDate.format('DD/MM/YYYY hh:mm A');
					}
				}
			}
			this.gridDataChanges.data = dataItems;
			this.gridDataChanges.total = total;
			this.gridMessages = this.sharedService.displayGridMessage(this.gridDataChanges.total);
			this.dataProcessing = false;
			if (this.subscription['getAppointments']) {
				this.subscription['getAppointments'].unsubscribe();
			}

		})
	}

	updateStatus(item: any) {
		for (let status of this.statusClergy) {
			if (item.status == status.code) {
				return status.name;
			}
		}
		return "Không Xác Định";
	}

	onDeactive(item: any) {
		let dataJSON = {
			status: 'inactive',
		}
		this.service.updateAppointment(item.id, dataJSON).pipe(take(1)).subscribe({
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

	addItem() {
		let config: any = {
			data: {
				target: 'new',
				entityID: this.entityID
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
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

	getRowSelected(item: any) {
		if (this.isNullOrEmpty(this.entityID)) {
			let config: any = {
				data: {
					target: 'edit',
					entityID: this.entityID,
					item: item
				}
			};
			config.disableClose = true;
			config.panelClass = 'dialog-form-l';
			config.maxWidth = '80vw';
			config.autoFocus = true;
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
			this.getDataGridApplications();
		})
	}

	registerGridColumns() {
		if (!this.isNullOrEmpty(this.entityID)) {
			this.displayColumns = ['id', 'clergyName', 'entityName', 'status', 'appointerName', 'effectiveDate', 'fromDate', 'toDate', 'created'];
		}
		else {
			this.displayColumns = ['id', 'clergyName', 'entityName', 'status', 'appointerName', 'effectiveDate', 'fromDate', 'toDate', 'created', 'moreActions'];
		}
	}


}
