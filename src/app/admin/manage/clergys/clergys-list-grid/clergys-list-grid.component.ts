import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { LEVEL_CLERGY } from 'src/app/shared/data-manage';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClergyInfoComponent } from '../clergy-info/clergy-info.component';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalSettings } from 'src/app/shared/global.settings';

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
		this.pageSize = 10;
		this.pageSizeOptions = [10, 25, 50];
		this.getDataGridAndCounterApplications();
	}

	getDataGridAndCounterApplications() {
		this.getDataGridApplications();
	}

	getDataGridApplications() {
		this.skip = this.currentPageIndex * this.pageSize;
		let options = {
			skip: this.skip,
			top: this.pageSize,
			filter: this.getFilter(),
			sort: 'name desc'
		}
		if (this.subscription['getClergies']) {
			this.subscription['getClergies'].unsubscribe();
		}
		this.dataProcessing = true;
		this.service.getClergies(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			let total = res.total || 0;
			if (res && res.value && res.value.length > 0) {
				let items = res.value;
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
				}
				this.gridDataChanges.data = items;
				this.gridDataChanges.total = total;
			}
		})
	}

	getFilter() {
		let filter = '';
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
		return filter;
	}

	onDeactive(item: any) {
		let dataJSON = {
			status: 'inactive',
		}
		this.service.updateClergy(item.id, dataJSON).pipe(take(1)).subscribe({
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
		this.service.updateClergy(item.id, dataJSON).pipe(take(1)).subscribe({
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
		let config: any = {};
		config.data = {
			target: 'add'
		};
		this.openFormDialog(config, 'add');
	}

	onChangeData(item: any) {
		this.router.navigate([`/admin/manage/clergys/clergy/${item.id}`]);
	}

	onViewDetail(item: any) {
		this.router.navigate([`/admin/clergy-view/${item.id}`]);
	}

	openFormDialog(config: any, target: string) {
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
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Linh Mục Thành Công' : 'Thêm Linh Mục Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataGridAndCounterApplications();
				}
				else if (res && res.action == 'save-open-detail') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Linh Mục Thành Công' : 'Thêm Linh Mục Thành Công';
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
			let options = {
				filter: `entityID eq ${item.id} and entityType eq 'clergy'`,
				sort: 'date desc'
			}
			item.stateLoadExpand = 'loading'
			this.service.getAnniversaries(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					// this.handleDataItem(res);
					if(res && res.value){
						for(let it of res.value){
							it.dateView = "Chưa cập nhật"
							if (it.date) {
								it._date = this.sharedService.convertDateStringToMoment(it.date, this.offset);
								it.dateView = this.sharedService.formatDate(it._date);
							}
						}
					}
					item.stateLoadExpand = 'loaded'
					item.expandData.anniversaries = res.value;
					item._expand_detail = !item._expand_detail;

				}
			})
		}
		else {
			item.stateLoadExpand = 'loaded'
			item._expand_detail = !item._expand_detail;
		}
	}


}
