import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { ChurchInfoComponent } from './church-info/church-info.component';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';

@Component({
	selector: 'app-churchs',
	templateUrl: './churchs.component.html',
	styleUrls: ['./churchs.component.scss']
})
export class ChurchsComponent extends ListItemBaseComponent {
	constructor(public override sharedService: SharedPropertyService,
		public snackbar: MatSnackBar,
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

}
