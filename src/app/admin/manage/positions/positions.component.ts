import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { PositionInfoComponent } from './position-info/position-info.component';

@Component({
	selector: 'se-positions',
	templateUrl: './positions.component.html',
	styleUrls: ['./positions.component.scss']
})
export class PositionsComponent extends ListItemBaseComponent {

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.searchKey = 'name';
		this.getDataItems();
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

	getDataItems() {
		let options = {
			filter: this.getFilter(),
			sort: 'status asc, name asc'
		}
		this.spinerLoading = true;
		this.service.getPositions(options).pipe(take(1)).subscribe((res: any) => {
			this.spinerLoading = false;
			this.arrData = [];
			if (res && res.value && res.value.length > 0) {
				let items = res.value;
				for (let item of items) {
					item.id = item.id;
					switch (item.status) {
						case 'active':
							item.statusTooltip = 'Hiện';
							item.statusIcon = 'ic_toggle_on';
							item.statusClass = 'active';
							break;
						case 'inactive':
							item.statusTooltip = 'Ẩn';
							item.statusIcon = 'ic_toggle_off';
							item.statusClass = 'inactive';
							break;
					}
				}
				this.arrData = items;
				this.noData = false;
			}
			else {
				if (this.txtSearch.value.length > 0) {
					this.noData = false;
				}
				else {
					this.noData = true;
				}
			}

		})
	}

	onAddItem() {
		let config: any = {};
		config.data = {
			target: 'add'
		};
		this.openFormDialog(config, 'add');
	}

	onChangeData(item: any) {
		let config: any = {};
		config.data = {
			target: 'edit',
			item: item
		};
		this.openFormDialog(config, 'edit');
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-sm';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(PositionInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Thành Công' : 'Thêm Thành Công';
					this.showInfoSnackbar(snackbarData);
					if (target == 'edit') {
					}
					else {
					}
					this.getDataItems();
				}
				else if (res === 'Deleted') {
					this.getDataItems();
				}
			}
		});
	}

}
