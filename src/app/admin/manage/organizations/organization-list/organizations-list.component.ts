import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { Router } from '@angular/router';
import { OrganizationInfoComponent } from '../organization-info/organization-info.component';

@Component({
	selector: 'app-organizations-list',
	templateUrl: './organizations-list.component.html',
	styleUrls: ['./organizations-list.component.scss']
})
export class OrganizationsListComponent extends ListItemBaseComponent {

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public router: Router,
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
						case 'publish':
							item.statusTooltip = 'Hiện';
							item.statusIcon = 'ic_toggle_on';
							item.class = 'active';
							break;
						case 'inactive':
							item.statusTooltip = 'Ẩn';
							item.statusIcon = 'ic_toggle_off';
							item.class = 'inactive';
							break;
						case 'draft':
						default:
							item.statusTooltip = 'Nháp';
							item.statusIcon = 'ic_toggle_off';
							item.class = 'draft';
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

	onDeactive(item: any) {
		let dataJSON = {
			status: 'inactive',
		}
		this.service.updateOrganization(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'inactivate-item',
					message: 'Ẩn Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

	onActive(item: any) {
		let dataJSON = {
			status: 'publish',
		}
		this.service.updateOrganization(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'activate-item',
					message: 'Hiện Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

	onAddItem() {
		let config: any = {
			data: {
				target: 'new'
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(OrganizationInfoComponent, config);
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

	onChangeData(item: any) {
		this.router.navigate([`/admin/manage/organizations/organization/${item.id}`]);
	}

	deleteItem(item: any) {
		this.dataProcessing = true;
		this.service.deleteOrganization(item.id).pipe(take(1)).subscribe(() => {
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
