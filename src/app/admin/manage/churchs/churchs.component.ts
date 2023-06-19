import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { ChurchInfoComponent } from './church-info/church-info.component';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
	selector: 'app-churchs',
	templateUrl: './churchs.component.html',
	styleUrls: ['./churchs.component.scss']
})
export class ChurchsComponent extends ListItemBaseComponent {
	constructor(public override sharedService: SharedPropertyService,
		public snackbar: MatSnackBar,
		private service: SharedService,
		public dialog: MatDialog) {
		super(sharedService,snackbar);
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
		let dialogRef = this.dialog.open(ChurchInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Giáo Phận Thành Công' : 'Thêm Giáo Phận Thành Công';
					this.showInfoSnackbar(snackbarData);
					if (target == 'edit') {
					}
					else {
					}
				}
				else if (res === 'Deleted') {
					
				}
			}
		});
	}

	getDataItems() {
		this.arrData = [];
		let filter = this.getFilter();
		let options = {
			sort: 'name asc, order asc',
			filter: filter
		}
		this.dataProcessing = true;
		this.spinerLoading = true;
		// this.service.getCategories(options).pipe(take(1)).subscribe({
		// 	next: (res: any) => {
		// 		if (res && res.value && res.value.length > 0) {
		// 			this.noData = false;
		// 			this.arrData = res.value;
		// 			let tempData = this.buildTreeData(res.value);
		// 			// for (let i = 0; i < 5; i++) {
		// 			// 	tempData.push(...tempData);
		// 			// }
		// 			this.rebuildTreeForData(tempData);
		// 		}
		// 		else {
		// 			this.noData = true;
		// 		}
		// 		this.dataProcessing = false;
		// 		this.spinerLoading = false;
		// 	}
		// })
	}

}
