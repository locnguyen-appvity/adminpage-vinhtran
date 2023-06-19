import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, takeUntil } from 'rxjs';
import { GlobalSettings } from '../../shared/global.settings';
import { SharedPropertyService } from '../../shared/shared-property.service';
import { SimpleBaseComponent } from '../../shared/simple.base.component';
import { ToastSnackbarAppComponent } from '../toast-snackbar/toast-snackbar.component';

@Component({
    selector: 'setting-base',
    template: ''
})
export class ListItemBaseComponent extends SimpleBaseComponent {

	public noData: boolean = true;
	public noDataSearch: boolean = false;
	public txtSearch: FormControl;
	public arrData: any[] = [];
	public searchValue: string = '';
	public spinerLoading: boolean = false;
	constructor(public override sharedService: SharedPropertyService,
		public snackbar: MatSnackBar) {
		super(sharedService);
		this.txtSearch = new FormControl('');
		this.txtSearch.valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), takeUntil(this.unsubscribe)).subscribe({
			next: (value: any) => {
				if (this.sharedService.isChangedValue(this.searchValue, value)) {
					this.doQuickSearch(value);
				}
			}
		});
	}

	showInfoSnackbar(dataInfo: any) {
		this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
			duration: 5000,
			data: dataInfo,
			horizontalPosition: 'start'
		});
	}

	getDataItems() {
	
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(name, '${quick}')`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}

	doQuickSearch(value: string) {
		this.searchValue = value;
		this.getDataItems();
	}

	sideNavMain() {

	}

	clearSearch() {
		this.txtSearch.setValue('');
	}

	onAddItem() {

	}

	onChangeData(item: any) {

	}

}