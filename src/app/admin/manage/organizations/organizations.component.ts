import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';

@Component({
	selector: 'app-organizations',
	templateUrl: './organizations.component.html',
	styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent extends ListItemBaseComponent {

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getDataItems();
	}

	getDataItems() {
		this.spinerLoading = true;
		let options = {
			filter: this.getFilter()
		}
		this.service.getOrganizations(options).pipe(take(1)).subscribe((res: any) => {
			this.spinerLoading = false;
			this.arrData = [];
			if (res && res.value && res.value.length > 0) {
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
				this.noData = false;
			}
			else {
				this.noData = true;
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
		config.panelClass = 'dialog-form-xl';
		config.maxWidth = '80vw';
		config.height = 'auto';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(OrganizationInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Giáo Xứ và Dòng Tu Thành Công' : 'Thêm Giáo Xứ và Dòng Tu Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
				else if (res === 'Deleted') {
					snackbarData.key = 'delete-item';
					snackbarData.message ='Xóa Giáo Xứ và Dòng Tu Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
			}
		});
	}

}
