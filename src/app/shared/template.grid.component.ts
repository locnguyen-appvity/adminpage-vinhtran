import { ViewChildren, OnDestroy, ViewChild, AfterViewInit, Component } from '@angular/core';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent, timer } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';
import { SimpleBaseComponent } from './simple.base.component';
import { GridDataChanges, GridDataSources } from './grid.datasources';
import { SharedPropertyService } from './shared-property.service';
import { LinqService } from './linq.service';
import { Store } from '@ngrx/store';
import { IAppState } from './redux/state';
import { SharedService } from './shared.service';
import { ToastSnackbarAppComponent } from '../controls/toast-snackbar/toast-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
declare let window: any;

@Component({
	selector: 'template-grid-base',
	template: ''
})
export class TemplateGridApplicationComponent extends SimpleBaseComponent implements AfterViewInit, OnDestroy {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatMenuTrigger) showHideColumn: any;
	@ViewChildren(MatMenuTrigger) trigger: any;
	public overlapTrigger = true;
	public displayColumns!: string[];
	public pageSizeOptions: number[];
	public quickFilterStatus: any;
	public dataSources: GridDataSources;
	public gridDataChanges: GridDataChanges;
	public sort: any[];
	public gridMessages: string = 'Loading...';
	public currentPageIndex: number = 0;
	public pageSize: number = 10;
	public filter: any = {
		quick: '',
		advanced: ''
	};
	public skip: number = 0;
	public searchControl: FormControl;
	public searchMode: boolean = false;
	public defaultMode: boolean = true;
	public searchValue: string = '';
	public statusFilterControl!: FormControl;
	public menuViewColumns: any = [];
	// public defaultMenuViewColumns: any = [];
	public linkDownLoad: any;
	public menuViewAllColumns: boolean = false;
	public indeterminateViewAllColumns: boolean = false;
	public dataSettings: any = {};
	public dataSettingsKey: string = '';
	// public appId: number;
	public defaultSort: string = '';
	public fileName: string = '';
	public stickyColumn: string = 'id';
	public dateOptions: string = 'day';
	public styleOptions: string = 'list';
	public selection: any;
	public itemSelectedTemplate: string = "";
	public filterSetting: any = {};

	constructor(
		public override sharedService: SharedPropertyService,
		public linq: LinqService,
		public store: Store<IAppState>,
		public service: SharedService,
		public snackbar: MatSnackBar,
	) {
		super(sharedService);
		this.sort = [];
		this.menuViewColumns = [];
		// this.defaultMenuViewColumns = [];
		this.skip = 0;
		this.pageSizeOptions = [5, 10, 25, 50];
		this.gridDataChanges = new GridDataChanges();
		this.dataSources = new GridDataSources(this.gridDataChanges);
		this.quickFilterStatus = this.getStatusDefault();
		this.registerGridColumns();
		this.selection = new SelectionModel<any>(true, []);
		this.searchControl = new FormControl('');
		this.initialControls();
		window._export_grid = '';
	}

	public getUserPermissions() {
		if (this.basePermissions.ready && !this.ready) {
			this.ready = true;
			this.initialMenuViewColumns();
			this.dataProcessing = true;
			// this.getDataSettings().pipe(takeUntil(this.unsubscribe)).subscribe({
			// 	next: () => {
			// this.getDataGridAndCounterApplications();
			// 	}
			// });
		}
	}

	showInfoSnackbar(dataInfo: any) {
		this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
			duration: 5000,
			data: dataInfo,
			horizontalPosition: 'start'
		});
	}

	resetPage() {
		this.currentPageIndex = 0;
		this.skip = 0;
		if (this.paginator) {
			this.paginator.pageIndex = 0;
		}
		this.selection.clear();
	}

	// public getValuesFromRedux() {
	//     this.store
	//         .select<IAppState>((state: any) => state.state)
	//         .pipe(takeUntil(this.unsubscribe))
	//         .subscribe((completeState: IAppState) => {
	//             this.sharedService.CurrentState = completeState;
	//             this.basePermissions = this.sharedService.CurrentState.userBasePermissions;
	//             this.getUserPermissions();
	//         });
	// }

	ngAfterViewInit() {
		this.initialMenuViewColumns();
		// this.getValuesFromRedux();
		this.searchControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.unsubscribe)).subscribe((value) => {
			if (this.isNullOrEmpty(value)) {
				this.searchMode = false;
			}
			else {
				this.searchMode = true;
			}
			if (this.sharedService.isChangedValue(this.searchValue, value)) {
				this.doQuickSearch(value);
			}
		});
		fromEvent(document, 'click').pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.triggerMenuPopup();
		});
	}

	getStatusDefault() { }

	getDataGridAndCounterApplications(): void { }

	getDataGridApplications(): void { }

	initialControls() {
		this.statusFilterControl = new FormControl('total');
		this.statusFilterControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.unsubscribe)).subscribe((value: string) => {
			for (let travel of this.quickFilterStatus) {
				if (travel.key === value) {
					travel.checked = true;
				}
				else {
					travel.checked = false;
				}
			}
			this.currentPageIndex = 0;
			this.skip = 0;
			if (this.paginator) {
				this.paginator.pageIndex = 0;
			}
			this.selection.clear();
			this.getDataGridApplications();
		});
	}

	doQuickSearch(searchValue: string) {
		if (!this.isNullOrEmpty(searchValue)) {
			searchValue = searchValue.replace("'", "`");
		}
		this.searchValue = searchValue;
		this.selection.clear();
		this.skip = 0;
		this.currentPageIndex = 0;
		if (this.paginator) {
			this.paginator.pageIndex = 0;
		}
		this.filter.quick = searchValue;
		this.getDataGridAndCounterApplications();
	}

	onDefaultMode() {
		this.defaultMode = true;
		this.searchMode = false;
		this.searchControl.setValue('');
	}

	onSearchMode() {
		this.defaultMode = false;
		this.searchMode = true;
	}

	clearSearch() {
		this.searchControl.setValue('');
	}

	//#region Show/Hide Columns
	getMenuViewColumns(): void { }

	initialMenuViewColumns() {
		this.menuViewColumns = this.getMenuViewColumns();
		// this.defaultMenuViewColumns = this.getMenuViewColumns();
		this.calculateCheckAllMenuColumns();
	}

	onMenuColumnsChanged() {
		for (let col of this.menuViewColumns) {
			col.curChecked = this.menuViewAllColumns;
		}
		this.indeterminateViewAllColumns = false;
	}

	onColumnChanged() {
		this.calculateCheckAllMenuColumns();
	}

	calculateCheckAllMenuColumns() {
		this.menuViewColumns = this.menuViewColumns || [];
		let iCheckAll: number = 0;
		for (let col of this.menuViewColumns) {
			if (col.curChecked) {
				iCheckAll++;
			}
		}
		if (iCheckAll === this.menuViewColumns.length) {
			this.menuViewAllColumns = true;
			this.indeterminateViewAllColumns = false;
		} else if (iCheckAll > 0) {
			this.menuViewAllColumns = false;
			this.indeterminateViewAllColumns = true;
		} else {
			this.menuViewAllColumns = false;
			this.indeterminateViewAllColumns = false;
		}
	}

	triggerMenuPopup = () => {
		let hasChanged: boolean = false;
		for (let col of this.menuViewColumns) {
			if (col.prevChecked !== col.curChecked) {
				hasChanged = true;
				break;
			}
		}
		if (!this.isNullOrEmpty(this.trigger) && hasChanged) {
			let arrMenu = this.trigger.toArray();
			for (let menu of arrMenu) {
				let menuItem: any = menu.menu;
				if (menuItem._classList['se-grid-application-list-menu-columns']) {
					menu.openMenu();
				}
			}
		}
	};

	undoChangedColumns() {
		this.updateDisplayColumns(true);
		this.calculateCheckAllMenuColumns();
	}

	onSaveDataSettings() {
		let data = {
			key: this.dataSettingsKey,
			value: JSON.stringify(this.dataSettings[this.dataSettingsKey])
		};
		this.dataProcessing = true;
		if (this.subscription['on_save_data_settings']) {
			this.subscription['on_save_data_settings'].unsubscribe();
		}
		// this.subscription['on_save_data_settings'] = this.service.setSettingStorageForUser(data).pipe(takeUntil(this.unsubscribe)).subscribe({
		// 		next: () => {
		// 			this.subscription['on_save_data_settings'].unsubscribe();
		// 			this.dataProcessing = false;
		// 		},
		// 		error: (error) => {
		// 			this.dataProcessing = false;
		// 			this.subscription['on_save_data_settings'].unsubscribe();
		// 			console.error(error);
		// 		}
		// 	});
	}


	updateStatus(item: any) {
		switch (item.status) {
			case 'publish':
			case 'active':
				item.statusView = "Đã Xuất Bản";
				item.statusClass = "approved-label";
				break;
			case 'inactive':
				item.statusView = "Tạm Ẩn"
				item.statusClass = "rejected-label";
				break;
			default:
				item.statusClass = "pending-label";
				item.statusView = "Lưu Nháp"
				break;
		}
	}

	applyToggleColumns() {
		if (this.dataProcessing) {
			return;
		}
		this.dataProcessing = true;
		this.updateDisplayColumns(false);
		this.calculateCheckAllMenuColumns();
		let dataChanged = {
			displayColumns: this.displayColumns,
			menuViewColumns: this.menuViewColumns
		};
		this.dataSettings[this.dataSettingsKey]['columns-changed'] = dataChanged;
		this.onSaveDataSettings();
	}

	applyPageSizeChanged() {
		this.dataSettings[this.dataSettingsKey]['page-size-changed'] = this.pageSize;
		this.onSaveDataSettings();
	}

	getDataSettings() {
		// return new Observable((obs: any) => {
		// 	if (this.subscription['get_data_settings']) {
		// 		this.subscription['get_data_settings'].unsubscribe();
		// 	}
		// 	this.dataSettings[this.dataSettingsKey] = {};
		// 	this.subscription['get_data_settings'] = this.service
		// 		.getSettingStorageForUser({ filter: "key eq '" + this.dataSettingsKey + "'" })
		// 		.pipe(takeUntil(this.unsubscribe))
		// 		.subscribe(
		// 			{
		// 				next: (res: any) => {
		// 					this.subscription['get_data_settings'].unsubscribe();
		// 					if (res && res.value && res.value.length > 0) {
		// 						let item = res.value[0];
		// 						let dataJSON = JSON.parse(item.value);
		// 						this.dataSettings[this.dataSettingsKey] = dataJSON;
		// 						this.filterSetting = {};
		// 						for (let key in this.dataSettings[this.dataSettingsKey]) {
		// 							let data = this.dataSettings[this.dataSettingsKey][key];
		// 							switch (key) {
		// 								case 'columns-changed':
		// 									// this.menuViewColumns = this.defaultMenuViewColumns;
		// 									if (!this.isNullOrEmpty(data.menuViewColumns)) {
		// 										// let menuViewColumns = this.defaultMenuViewColumns;
		// 										// let menuColumns = [];
		// 										for (let _field of data.menuViewColumns) {
		// 											if (_field.checked !== undefined) {
		// 												_field.prevChecked = _field.curChecked = _field.checked ? true : false;
		// 												delete _field.checked;
		// 											}
		// 											for (let field of this.menuViewColumns) {
		// 												if (field.column === _field.column) {
		// 													field.curChecked = _field.curChecked;
		// 													field.prevChecked = _field.prevChecked;
		// 													// menuColumns.push(field);
		// 													break;
		// 												}
		// 											}
		// 										}
		// 										// this.menuViewColumns = menuColumns;
		// 									}
		// 									this.updateDisplayColumns(false);
		// 									this.calculateCheckAllMenuColumns();
		// 									if (!this.isNullOrEmpty(data.displayColumns) && data.displayColumns.length > 0) {
		// 										this.displayColumns = data.displayColumns;
		// 									}
		// 									break;
		// 								case 'page-size-changed':
		// 									if (data) {
		// 										let pageSize = parseInt(data);
		// 										if (!isNaN(pageSize)) {
		// 											this.pageSize = pageSize;
		// 										}
		// 									}
		// 									break;
		// 								case 'sort-changed':
		// 									if (data) {
		// 										this.sort = data;
		// 									}
		// 									break;
		// 								// case 'date-option-changed':
		// 								// 	if (data) {
		// 								// 		this.dateOptions = data;
		// 								// 	}
		// 								// 	break;
		// 								// case 'style-option-changed':
		// 								// 	if (data) {
		// 								// 		this.styleOptions = data;
		// 								// 	}
		// 								// 	break;
		// 								case 'remember-filters':
		// 									if (data) {
		// 										this.filterSetting = data;
		// 									}
		// 								// case 'quick-search-changed':
		// 								// 	if (data) {
		// 								// 		this.searchControl.setValue(data);
		// 								// 	}
		// 								// 	break;
		// 							}
		// 						}
		// 						this.applyFilterSetting();
		// 					}
		// 					else {
		// 						this.filterSetting = {};
		// 						this.applyFilterSetting();
		// 					}
		// 					obs.next('OK');
		// 					obs.complete();
		// 				},
		// 				error: (error: any) => {
		// 					this.subscription['get_data_settings'].unsubscribe();
		// 					console.log(error);
		// 					this.filterSetting = {};
		// 					this.applyFilterSetting();
		// 					obs.next('OK');
		// 					obs.complete();
		// 				}
		// 			});
		// });
	}

	applyFilterSetting() {

	}

	updateDisplayColumns(undo: boolean) {
		let columns = [];
		columns.push(this.stickyColumn);
		for (let col of this.menuViewColumns) {
			if (undo) {
				if (col.prevChecked) {
					columns.push(col.column);
				}
				col.curChecked = col.prevChecked;
			}
			else {
				if (col.curChecked) {
					columns.push(col.column);
				}
				col.prevChecked = col.curChecked;
			}
		}
		columns.push('actions');
		this.displayColumns = columns;
	}

	registerGridColumns(): void { }

	//#endregion

	getFilters(statusCounter: string) { }

	getSorts() {
		let sortQuery = this.defaultSort;
		if (this.sort && this.sort.length > 0) {
			const sorts = this.sort;
			sortQuery = "";
			for (let sortItem of sorts) {
				let direction = sortItem.direction;
				let active = sortItem.active;
				if (direction) {
					sortQuery += `${active} ${direction},`
				}
				else {
					sortQuery += `${active} asc,`
				}
			}
		}
		sortQuery = sortQuery.replace(/,$/g, "");
		return sortQuery;
	}

	onSortChange($event: any) {
		this.dataProcessing = true;
		this.selection.clear();
		this.sort = [];
		this.sort.push($event);
		this.dataSettings[this.dataSettingsKey]['sort-changed'] = this.sort;
		this.onSaveDataSettings();
		this.getDataGridApplications();
	}

	pageChanged($event: any) {
		this.selection.clear();
		if (this.currentPageIndex !== $event.pageIndex) {
			this.currentPageIndex = $event.pageIndex;
			this.pageSize = $event.pageSize;
			this.applyPageSizeChanged();
			this.getDataGridApplications();
			return;
		}
		if (this.pageSize < $event.pageSize) {
			this.pageSize = $event.pageSize;
			this.applyPageSizeChanged();
			this.getDataGridApplications();
		}
		else {
			this.pageSize = $event.pageSize;
			this.applyPageSizeChanged();
			let data = this.gridDataChanges.data;
			data = this.linq.Enumerable().From(data).Take(this.pageSize).ToArray();
			this.gridDataChanges.data = data;
		}
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		let items = this.gridDataChanges.data;
		items = this.linq.Enumerable().From(items).Where("$.disabledItem == false").ToArray();
		const numRows = items.length;
		return numSelected === numRows;
	}

	public updateItemSelectTemplate() {
		let itemText = 'item';
		if (this.selection.selected.length > 1) {
			itemText = "items";
		}
		let itemSelectedTemplate = '';
		if (this.selection.selected.length > 0) {
			itemSelectedTemplate = `${this.selection.selected.length} ${itemText} selected`;
		}
		timer(20).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: () => {
				this.itemSelectedTemplate = itemSelectedTemplate;
			}
		});
	}

	isAllDisabled() {
		let items = this.gridDataChanges.data;
		items = this.linq.Enumerable().From(items).Where("$.disabledItem == false").ToArray();
		return items.length === 0;
	}

	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.gridDataChanges.data.filter(row => !row.disabledItem).forEach(row => this.selection.select(row));
	}

	checkAllItems($event: any) {
		$event ? this.masterToggle() : null;
		this.updateItemSelectTemplate()
	}

	checkSingleItem($event: any, dataItem: any) {
		$event ? this.selection.toggle(dataItem) : null;
		this.updateItemSelectTemplate()
	}

	toggleQuickFilterStatus(dataItem: any) {
		this.dataProcessing = true;
		this.currentPageIndex = 0;
		if (this.paginator) {
			this.paginator.pageIndex = 0;
		}
		this.selection.clear();
		for (let item of this.quickFilterStatus) {
			item.checked = false;
		}
		dataItem.checked = !dataItem.checked;
		this.statusFilterControl.setValue(dataItem.key);
	}

	lastChildBorderStyles() {
		const borderStyle = {
			'border-color': '#e0e0e0',
		};
		return borderStyle;
	}

	firstChildBorderStyles() {
		const borderStyle = {
			'border-color': '#e0e0e0',
		};
		return borderStyle;
	}

	windowFocus = () => {
		try {
			URL.revokeObjectURL(this.linkDownLoad);
			this.dataProcessing = false;
			this.linkDownLoad = {};
		} catch (error) {
			this.dataProcessing = false;
			this.linkDownLoad = {};
		}
	};

	override ngOnDestroy() {
		if (this.gridDataChanges && this.gridDataChanges.dataChanges) {
			this.gridDataChanges.dataChanges.complete();
			this.gridDataChanges.dataChanges.unsubscribe();
			// this.gridDataChanges.dataChanges = null;
		}
		super.ngOnDestroy();
	}
}
