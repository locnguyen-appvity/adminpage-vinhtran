import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SaintInfoComponent } from './saint-info/saint-info.component';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';

@Component({
	selector: 'se-saints',
	templateUrl: './saints.component.html',
	styleUrls: ['./saints.component.scss']
})
export class SaintsComponent extends ListItemBaseComponent {
	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService,snackbar);
		this.getDataItems();
	}

	getDataItems() {
		this.spinerLoading = true;
		let options = {
			filter: this.getFilter(),
			sort:'name asc'
		}
		// this.service.getSaints(options).pipe(take(1)).subscribe((res: any) => {
		// 	this.arrData = [];
		// 	this.spinerLoading = false;
		// 	if (res && res.value && res.value.length > 0) {
		// 		let items = res.value;
		// 		for (let item of items) {
		// 			item.id = item._id;
		// 			switch (item.deActive) {
		// 				case -1:
		// 					item.status = 'Draft';
		// 					item.statusIcon = 'ic_post_add';
		// 					item.class = 'draft';
		// 					break;
		// 				case 0:
		// 					item.status = 'Active';
		// 					item.statusIcon = 'ic_toggle_on';
		// 					item.class = 'active-status';
		// 					break;
		// 				case 1:
		// 					item.status = 'Inactive';
		// 					item.statusIcon = 'ic_toggle_off';
		// 					item.class = 'inactive-status';
		// 					break;
		// 			}
		// 		}
		// 		this.arrData = items;
		// 		this.noData = false;
		// 		this.noDataSearch = false;
		// 	}
		// 	else {
		// 		if (this.txtSearch.value.length > 0) {
		// 			this.noData = false;
		// 			this.noDataSearch = true;
		// 		}
		// 		else {
		// 			this.noData = true;
		// 			this.noDataSearch = false;
		// 		}
		// 	}

		// })
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
		let dialogRef = this.dialog.open(SaintInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Thánh Thành Công' : 'Thêm Thánh Thành Công';
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
