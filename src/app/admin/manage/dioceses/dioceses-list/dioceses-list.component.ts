import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { DioceseInfoComponent } from '../diocese-info/diocese-info.component';
import { DIOCESES_DATA } from 'src/app/shared/data-manage';

@Component({
	selector: 'se-dioceses-list',
	templateUrl: './dioceses-list.component.html',
	styleUrls: ['./dioceses-list.component.scss']
})
export class DiocesesListComponent extends ListItemBaseComponent {
	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getDataItems();
	}

	getDataItems() {
		let options = {
			sort:'name asc'
		}
		this.spinerLoading = true;
		this.service.getDioceses(options).pipe(take(1)).subscribe((res: any) => {
			this.spinerLoading = false;
			this.arrData = [];
			if (res && res.value && res.value.length > 0) {
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
				this.noData = false;
			}
			else {
				if (this.txtSearch.value.length > 0) {
					this.noData = false;
				}
				else {
					this.noData = true;
				}
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
		config.autoFocus = true;
		let dialogRef = this.dialog.open(DioceseInfoComponent, config);
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
					this.getDataItems();
				}
				else if (res === 'Deleted') {
					this.getDataItems();
				}
			}
		});
	}

	onAddAuto() {
		// this.updateAddAuto(this.arrData);
		let dataDefault = DIOCESES_DATA;
		if (dataDefault && dataDefault.length > 0) {
			this.spinerLoading = true;
			this.dataProcessing = true;
			let sub = new BehaviorSubject(0);
			sub.subscribe({
				next: (index: number) => {
					if (index < dataDefault.length) {
						if (dataDefault[index]) {
							let valueForm = dataDefault[index];
							let dataJSON = {
								name: valueForm.name,
								type: "diocese",
								status: 'active'
							}
							this.service.createDiocese(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
								next: () => {
									index++;
									sub.next(index);
								},
								error: error => {
									console.log(error);
									index++;
									sub.next(index);
								}
							});

						}
						else {
							index++;
							sub.next(index);
						}
					}
					else {
						this.dataProcessing = false;
						this.spinerLoading = false;
						this.getDataItems();
						sub.complete();
						sub.unsubscribe();
					}

				}
			});
		}
	}

}
