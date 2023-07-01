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

	public positionList: any[] = [];
	public typeList: any[] = [];

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getDataItems();
	}

	getAllData() {
		// forkJoin({ clergyPosition: this.getListClergyPosition(), clergyType: this.getListClergyType() }).pipe(take(1)).subscribe({
		// 	next: () => {
		// 		this.getDataItems();
		// 	}
		// })
	}

	getListClergyPosition() {
		this.positionList = [];
		// return this.service.getListClergyPosition().pipe(take(1), map((res: any) => {
		// 	if (res && res.value && res.value.length > 0) {
		// 		this.positionList = res.value;
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

	handleClergyPosition(item: any) {
		for (let position of this.positionList) {
			if (item.position == position.code) {
				item.positionName = position.name;
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
		this.service.getClergies(options).pipe(take(1)).subscribe((res: any) => {
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
					item = this.handleClergyType(item);
					item = this.handleClergyPosition(item);
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
