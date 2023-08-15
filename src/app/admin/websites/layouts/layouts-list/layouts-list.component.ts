import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { LayoutInfoComponent } from '../layout-info/layout-info.component';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { Store } from '@ngrx/store';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-layouts-list',
	templateUrl: './layouts-list.component.html',
	styleUrls: ['./layouts-list.component.scss']
})
export class LayoutsListComponent extends TemplateGridApplicationComponent implements OnChanges, AfterViewInit {

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
		this.dataSettingsKey = 'layouts-list';
		this.getDataGridAndCounterApplications();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['groupID']) {
			this.getDataGridAndCounterApplications();
			this.registerGridColumns();
		}
	}

	getFilter(groupID: string = "") {
		let filter = ``;
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
		this.skip = this.currentPageIndex * this.pageSize;
		let options = {
			filter: this.getFilter(),
			sort: 'created desc',
			skip: this.skip,
			top: this.pageSize
		}
		if (this.subscription['getLayouts']) {
			this.subscription['getLayouts'].unsubscribe();
		}
		this.dataProcessing = true;
		this.subscription['getLayouts'] = this.service.getLayouts(options).pipe(take(1)).subscribe((res: any) => {
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
			if (this.subscription['getLayouts']) {
				this.subscription['getLayouts'].unsubscribe();
			}

		})
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status,
		}
		this.service.updateLayout(item.id, dataJSON).pipe(take(1)).subscribe({
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
				type: this.type
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(LayoutInfoComponent, config);
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
		this.router.navigate([`/admin/manage/${item.type}/detail/${item.id}`]);
	}

	onView(item: any) {
		this.router.navigate([`/page/layout/${item.id}`]);
	}

	onDelete(item: any) {
		this.dataProcessing = true;
		this.service.deleteLayout(item.id).pipe(take(1)).subscribe(() => {
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
		this.displayColumns = ['id', 'status', 'type', 'name', 'created', 'moreActions'];
	}


}
