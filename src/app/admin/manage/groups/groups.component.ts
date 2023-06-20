import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { GroupInfoComponent } from './group-info/group-info.component';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
	selector: 'app-groups',
	templateUrl: './groups.component.html',
	styleUrls: ['./groups.component.scss']
})
export class GroupsComponent extends ListItemBaseComponent {
	constructor(public override sharedService: SharedPropertyService,
		public snackbar: MatSnackBar,
		private service: SharedService,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getDataItems();
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
		let dialogRef = this.dialog.open(GroupInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Giáo Hạt Thành Công' : 'Thêm Giáo Hạt Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
				else if (res === 'Deleted') {
					snackbarData.key = 'delete-item';
					snackbarData.message ='Xóa Giáo Hạt Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
			}
		});
	}

	getDataItems() {
		this.arrData = [];
		let filter = this.getFilter();
		let options = {
			sort: 'name asc',
			filter: filter
		}
		this.dataProcessing = true;
		this.spinerLoading = true;
		this.service.getGroups(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					let items = res.value;
					for (let item of items) {
						switch (item.status) {
							case 'active':
								item.statusTooltip = 'Hiện';
								item.statusIcon = 'ic_toggle_on';
								item.class = 'active-status';
								break;
							case 'inactive':
								item.statusTooltip = 'Ẩn';
								item.statusIcon = 'ic_toggle_off';
								item.class = 'inactive-status';
								break;
						}
					}
					this.arrData = items;
				}
				else {
					this.noData = true;
				}
				this.dataProcessing = false;
				this.spinerLoading = false;
			}
		})
	}

}
