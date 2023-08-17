import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { LayoutInfoComponent } from '../layout-info/layout-info.component';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-layouts-list',
	templateUrl: './layouts-list.component.html',
	styleUrls: ['./layouts-list.component.scss']
})
export class LayoutsListComponent extends ListItemBaseComponent implements OnChanges {

	@Input() type: string;

	constructor(
		public sharedService: SharedPropertyService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog,
		private service: SharedService
	) {
		super(sharedService,snackbar);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['type']) {
			this.getDataItems();
		}
	}

	getFilter() {
		let filter = `type eq '${this.type}'`;
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(name), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = `${filter} and (${quickSearch})`;
			}
		}
		return filter;
	}

	getDataItems() {
		let options = {
			filter: this.getFilter(),
			sort: 'created desc'
		}
		if (this.subscription['getLayouts']) {
			this.subscription['getLayouts'].unsubscribe();
		}
		this.dataProcessing = true;
		this.subscription['getLayouts'] = this.service.getLayouts(options).pipe(take(1)).subscribe((res: any) => {
			let dataItems = [];
			if (res && res.value && res.value.length > 0) {
				dataItems = res.value;
				this.noData = false;
				for (let item of dataItems) {
				}
			}
			this.arrData = dataItems;
			this.dataProcessing = false;
			if (this.subscription['getLayouts']) {
				this.subscription['getLayouts'].unsubscribe();
			}

		})
	}

	onAddItem() {
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
					this.getDataItems();
				}
			}
		});
	}

	deleteItem(item: any) {
		this.dataProcessing = true;
		this.service.deleteLayout(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			let snackbarData: any = {
				key: 'delete-item',
				message: 'Xóa Thành Công'
			};
			this.showInfoSnackbar(snackbarData);
			this.getDataItems();
		})
	}


}
