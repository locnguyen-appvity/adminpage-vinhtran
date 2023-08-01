import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedService } from 'src/app/shared/shared.service';
import { GroupInfoComponent } from '../group-info/group-info.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-groups-list',
	templateUrl: './groups-list.component.html',
	styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent extends ListItemBaseComponent {

	public type: string = "giao_hat";
	public title: string = "Giáo Hạt";

	constructor(public override sharedService: SharedPropertyService,
		public snackbar: MatSnackBar,
		private service: SharedService,
		public router: Router,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		if (this.router.url.includes("hoi_doan")) {
			this.type = 'hoi_doan';
			this.title = 'Hội Đoàn';
		}
		else if (this.router.url.includes("co_so_giao_phan")) {
			this.type = 'co_so_giao_phan';
			this.title = 'Cơ Sở Giáo Phận';
		}
		else if (this.router.url.includes("co_so_ngoai_giao_phan")) {
			this.type = 'co_so_ngoai_giao_phan';
			this.title = 'Cơ Sở Ngoài Giáo Phận';
		}
		else if (this.router.url.includes("ban_muc_vu")) {
			this.type = 'ban_muc_vu';
			this.title = 'Ban Mục Vụ';
		}
		else if (this.router.url.includes("ban_chuyen_mon")) {
			this.type = 'ban_chuyen_mon';
			this.title = 'Ban Chuyên Môn';
		}
		else if (this.router.url.includes("dong_tu")) {
			this.type = 'dong_tu';
			this.title = 'Dòng Tu';
		}
		else if (this.router.url.includes("cong_doan")) {
			this.type = 'cong_doan';
			this.title = 'Cộng Đoàn';
		}
		this.getDataItems();
	}

	onAddItem() {
		let config: any = {};
		config.data = {
			target: 'add',
			typeGroup: this.type
		};
		this.openFormDialog(config, 'add');
	}

	onChangeData(item: any) {
		this.router.navigate([`/admin/manage/${this.type}/detail/${item.id}`]);
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-xl';
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
					snackbarData.message = 'Xóa Giáo Hạt Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
			}
		});
	}

	getFilter() {
		let filter = `type eq '${this.type}'`;
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(${this.searchKey}), tolower('${quick}'))`;
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
								item.class = 'active';
								break;
							case 'inactive':
								item.statusTooltip = 'Ẩn';
								item.statusIcon = 'ic_toggle_off';
								item.class = 'inactive';
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

	deleteItem(item: any) {
		this.service.deleteGroup(item.id).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'delete-item',
					message: 'Xóa Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.dataProcessing = false;
				this.getDataItems();
			}
		})
	}

	updateStatus(item: any, status: string) {
		let dataJSON = {
			status: status
		}
		this.service.updateGroup(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.dataProcessing = false;
				this.getDataItems();
			}
		})
	}

}