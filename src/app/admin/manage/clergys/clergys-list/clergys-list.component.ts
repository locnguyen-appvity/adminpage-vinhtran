import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { ClergyInfoComponent } from '../clergy-info/clergy-info.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-clergys-list',
	templateUrl: './clergys-list.component.html',
	styleUrls: ['./clergys-list.component.scss']
})
export class ClergysListComponent extends ListItemBaseComponent {

	public positionList: any[] = [];
	public typeList: any[] = [];

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public router: Router,
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
						case 'publish':
							item.statusTooltip = 'Hiện';
							item.statusIcon = 'ic_toggle_on';
							item.statusClass = 'active';
							break;
						case 'inactive':
							item.statusTooltip = 'Ẩn';
							item.statusIcon = 'ic_toggle_off';
							item.statusClass = 'inactive';
							break;
						case 'draft':
						default:
							item.statusTooltip = 'Nháp';
							item.statusIcon = 'ic_toggle_off';
							item.statusClass = 'draft';
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
		this.router.navigate([`/admin/manage/clergys/clergy/${item.id}`]);
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
