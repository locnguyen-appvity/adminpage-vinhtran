import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { take, takeUntil } from 'rxjs';
import { MassesInfoComponent } from '../masses-info/masses-info.component';

@Component({
	selector: 'app-masses-list',
	templateUrl: './masses-list.component.html',
	styleUrls: ['./masses-list.component.scss'],
})

export class MassesListComponent extends ListItemBaseComponent implements OnChanges {

	@Input() entityID: string = "";
	@Input() entityType: string = ""
	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['entityID'] || changes['entityType']){
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
		this.service.deleteMasses(item.id).pipe(take(1)).subscribe({
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
		this.service.updateMasses(item.id, dataJSON).pipe(take(1)).subscribe({
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
		let dialogRef = this.dialog.open(MassesInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Giờ Lễ Thành Công' : 'Thêm Giờ Lễ Thành Công';
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
		this.service.getMasseses(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					this.arrData = res.value;
				}
				else {
					this.noData = true;
				}
				this.dataProcessing = false;
				this.spinerLoading = false;
			}
		})
	}

}

