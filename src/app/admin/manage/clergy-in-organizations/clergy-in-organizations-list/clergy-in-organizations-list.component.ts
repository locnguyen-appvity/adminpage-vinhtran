import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { take, takeUntil } from 'rxjs';
import { ClergyInOrganizationsInfoComponent } from '../clergy-in-organizations-info/clergy-in-organizations-info.component';
import { POSSITION, TYPE_CLERGY } from 'src/app/shared/data-manage';

@Component({
	selector: 'app-clergy-in-organizations-list',
	templateUrl: './clergy-in-organizations-list.component.html',
	styleUrls: ['./clergy-in-organizations-list.component.scss'],
})

export class ClergyInOrganizationsListComponent extends ListItemBaseComponent implements OnChanges {

	@Input() entityID: string = "";
	@Input() entityType: string = "";
	public positionList: any[] = POSSITION;
	public typeList: any[] = TYPE_CLERGY;
	
	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType']) {
			this.getDataItems();
		}
	}


	onAddItem() {
		let config: any = {};
		config.data = {
			type: 'new',
			entityID: this.entityID,
			entityType: this.entityType
		};
		this.openFormDialog(config, 'new');
	}

	deleteItem(item: any) {
		this.dataProcessing = true;
		this.service.deleteClergyInOrganization(item.id).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				let snackbarData: any = {
					key: 'delete-item',
					message: 'Xóa Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status
		}
		this.dataProcessing = true;
		this.service.updateClergyInOrganization(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				let snackbarData: any = {
					key: 'delete-item',
					message: 'Xóa Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

	onChangeData(item: any) {
		let config: any = {};
		config.data = {
			item: item,
			type: 'edit',
			entityID: this.entityID,
			entityType: this.entityType
		};
		this.openFormDialog(config, 'edit');
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(ClergyInOrganizationsInfoComponent, config);
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
			}
		});
	}

	// drop(event: CdkDragDrop<unknown>) {
	// 	moveItemInArray(this.arrData, event.previousIndex, event.currentIndex);
	// }

	getDataItems() {
		let options = {
			filter: `entityId eq ${this.entityID} and entityType eq '${this.entityType}'`
		}
		this.arrData = [];
		this.dataProcessing = true;
		this.spinerLoading = true;
		this.service.getClergyInOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					this.arrData = res.value;
					for (let item of this.arrData) {
						this.getClergyPosition(item);
						this.getClergyStatus(item);
						if (item && item.fromDate) {
							item._fromDate = this.sharedService.convertDateStringToMomentUTC_0(item.fromDate);
							item.fromDateView = item._fromDate.format('DD/MM/YYYY');
						}
						if (item && item.toDate) {
							item._toDate = this.sharedService.convertDateStringToMomentUTC_0(item.toDate);
							item.toDateView = item._toDate.format('DD/MM/YYYY');
						}
					}
				}
				else {
					this.noData = true;
				}
				this.dataProcessing = false;
				this.spinerLoading = false;
			}
		})
	}

	// getClergy(item: any) {
	// 	if(!this.isNullOrEmpty(item.clergyID)){
	// 		this.service.getClergy(item.clergyID).pipe(take(1)).subscribe({
	// 			next: (res: any) => {
	// 				item.typeClergy = res.type;
	// 			}
	// 		})
	// 	}
	// }

	getClergyPosition(item: any) {
		item.positionView = 'Chưa xác định'
		if (!this.isNullOrEmpty(item.position)) {
			let position = this.sharedService.getValueAutocomplete(item.position, this.positionList, 'code');
			if (position && position.name) {
				item.positionView = position.name;
			}
		}
	}

	getClergyStatus(item: any) {
		item.statusView = 'Chưa xác định'
		switch (item.status) {
			case 'duong_nhiem':
				item.statusView = 'Đương nhiệm';
				break;
			case 'man_nhiem':
				item.statusView = 'Mãn nhiệm';
				break;
		}
	}

}

