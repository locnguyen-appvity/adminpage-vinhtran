import { AfterViewInit, Component, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { MigrationInfoComponent } from '../migration-info/migration-info.component';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-migrations-list',
	templateUrl: './migrations-list.component.html',
	styleUrls: ['./migrations-list.component.scss'],
	animations: [
		trigger('detailExpand', [
		  state('collapsed', style({height: '0px', minHeight: '0'})),
		  state('expanded', style({height: '*'})),
		  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	  ],
})
export class MigrationsListComponent extends TemplateGridApplicationComponent implements OnChanges, AfterViewInit {

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
		// if (!this.isNullOrEmpty(this.groupID)) {
		// 	if (this.isNullOrEmpty(filter)) {
		// 		filter = `groupID eq ${this.groupID}`;
		// 	}
		// 	else {
		// 		filter = `(${filter}) and (groupID eq ${this.groupID})`;
		// 	}
		// }
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
		if (this.subscription['getMigrations']) {
			this.subscription['getMigrations'].unsubscribe();
		}
		this.dataProcessing = true;
		this.subscription['getMigrations'] = this.service.getMigrations(options).pipe(take(1)).subscribe((res: any) => {
			let dataItems = [];
			let total = res.total || 0;
			if (res && res.value && res.value.length > 0) {
				dataItems = res.value;
				for (let item of dataItems) {
					item.disabledItem = false;
					item._expand_detail = false;
					item.clergyName = "Linh Mục Giuse Nguyên Văn An";
					if (item.created) {
						item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
						item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
					}
					item.fromAppointment = {
						entityName:"Dòng Thánh Tâm Chúa",
						appointerName:"Giám Mục Giuse Nguyễn Tấn Tước",
						positionView:"Phó Xứ",
						fromDateView: "19/07/2023 07:00 AM",
						toDateView: "23/07/2023 07:00 AM"
					}
					item.toAppointment = {
						entityName:"Giáo Xứ Lai Thiêu",
						appointerName:"Giám Mục Giuse Nguyễn Tấn Tước",
						positionView:"Chánh Xứ",
						fromDateView: "19/09/2023 07:00 AM",
						toDateView: "12/09/2023 07:00 AM"
					}
					this.updateStatus(item);
				}
			}
			this.gridDataChanges.data = dataItems;
			this.gridDataChanges.total = total;
			this.gridMessages = this.sharedService.displayGridMessage(this.gridDataChanges.total);
			this.dataProcessing = false;
			if (this.subscription['getMigrations']) {
				this.subscription['getMigrations'].unsubscribe();
			}

		})
	}

	updateStatus(item: any) {
		switch (item.status) {
			case 'approved':
			case 'active':
				item.statusView = "Đã Xuất Bản";
				item.statusClass = "approved-label";
				break;
			case 'rejected':
				item.statusView = "Đã Hủy"
				item.statusClass = "rejected-label";
				break;
			default:
				item.statusClass = "pending-label";
				item.statusView = "Lưu Nháp"
				break;
		}
	}

	onDeactive(item: any) {
		let dataJSON = {
			status: 'inactive',
		}
		this.service.updateMigration(item.id, dataJSON).pipe(take(1)).subscribe({
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
		this.service.updateMigration(item.id, dataJSON).pipe(take(1)).subscribe({
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
				// groupID: this.groupID
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(MigrationInfoComponent, config);
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
		let config: any = {
			data: {
				target: 'edit',
				item: item
				// groupID: this.groupID
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(MigrationInfoComponent, config);
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

	toggleExpandElements(item: any) {
		item._expand_detail = !item._expand_detail;
	}

	onDelete(item: any) {
		this.dataProcessing = true;
		this.service.deleteMigration(item.id).pipe(take(1)).subscribe(() => {
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
		this.displayColumns = ['id', 'clergyName', 'fromOrgName', 'toOrgName', 'status', 'created', 'moreActions'];
	}


}
