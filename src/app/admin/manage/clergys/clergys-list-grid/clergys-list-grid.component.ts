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
					item.fullName = `${this.sharedService.getClergyLevel(item)} ${item.stName}  ${item.name}`
					item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_priest.svg')
					if (item.photo) {
						item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
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

	addItem(item?: any) {
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
		let dialogRef = this.dialog.open(ClergyInfoComponent, config);
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
			this.getDataGridApplications();
		})
	}

	registerGridColumns() {
		this.displayColumns = ['id', 'photo', 'name', 'status', 'phoneNumber', 'email', 'fatherName', 'motherName', 'created', 'moreActions'];
	}

	toggleExpandElements(item: any) {
		if (item.readyLoadExpand) {
			item._expand_detail = !item._expand_detail;
			return;
		}
		if (!this.isNullOrEmpty(item.fromClergyID)) {
			this.service.getClergy(item.fromClergyID).pipe(take(1)).subscribe({
				next: (res: any) => {
					// this.handleDataItem(res);
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
