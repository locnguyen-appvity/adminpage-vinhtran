import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ClergyInfoComponent } from './clergy-info/clergy-info.component';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';

@Component({
	selector: 'app-clergys',
	templateUrl: './clergys.component.html',
	styleUrls: ['./clergys.component.scss']
})
export class ClergysComponent extends ListItemBaseComponent {

	public possisionList: any[] = [];
	public typeList: any[] = [];

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getAllData();
	}

	getAllData() {
		// forkJoin({ clergyPossision: this.getListClergyPossision(), clergyType: this.getListClergyType() }).pipe(take(1)).subscribe({
		// 	next: () => {
		// 		this.getDataItems();
		// 	}
		// })
	}

	getListClergyPossision() {
		this.possisionList = [];
		// return this.service.getListClergyPossision().pipe(take(1), map((res: any) => {
		// 	if (res && res.value && res.value.length > 0) {
		// 		this.possisionList = res.value;
		// 	}
		// }));
	}

	getListClergyType() {
		this.typeList = [];
		// return this.service.getListClergyType().pipe(take(1), map(
		// 	(res: any) => {
		// 		if (res && res.value && res.value.length > 0) {
		// 			this.typeList = res.value;
		// 		}
		// 	}
		// ))
	}

	handleClergyPossision(item: any) {
		for (let possision of this.possisionList) {
			if (item.possision == possision.code) {
				item.possisionName = possision.name;
				return item;
			}
		}
		return item;
	}

	handleClergyType(item: any) {
		for (let type of this.typeList) {
			if (item.type == type.code) {
				item.typeName = type.name;
				return item;
			}
		}
		return item;
	}

	getDataItems() {
		this.spinerLoading = true;
		let options = {
			filter: this.getFilter()
		}
		// this.service.getClergys(options).pipe(take(1)).subscribe((res: any) => {
		// 	this.spinerLoading = false;
		// 	this.arrData = [];
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
		// 			item = this.handleClergyType(item);
		// 			item = this.handleClergyPossision(item);
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
		config.panelClass = 'dialog-form-m';
		config.maxWidth = '80vw';
		config.height = 'auto';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(ClergyInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Tu Sĩ Thành Công' : 'Thêm Tu Sĩ Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
				else if (res === 'Deleted') {
					this.getDataItems();
				}
			}
		});
	}

}
