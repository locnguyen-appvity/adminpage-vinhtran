import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { take } from 'rxjs';

@Component({
	selector: 'app-appointments-list-control',
	templateUrl: './appointments-list-control.component.html',
	styleUrls: ['./appointments-list-control.component.scss'],
})

export class AppointmentsListComponent extends ListItemBaseComponent implements OnChanges {

	@Input() entityID: string = "";
	@Input() entityType: string = "";
	public positionList: any[] = [];
	
	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getPositions();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType']) {
			this.getDataItems();
		}
	}

	getPositions() {
		// let options = {
		// 	filter: "type eq 'giao_xu'"
		// }
		this.positionList = [];
		this.service.getPositions().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionList = items;
			}
		})
	}


	// onAddItem() {
	// 	let clergyID = '';
	// 	let entityID = '';
	// 	if(this.entityType == 'clergy'){
	// 		clergyID = this.entityID;
	// 	}
	// 	else {
	// 		entityID = this.entityID;
	// 	}
	// 	let config: any = {};
	// 	config.data = {
	// 		type: 'new',
	// 		entityID: entityID,
	// 		clergyID: clergyID,
	// 		entityType: this.entityType
	// 	};
	// 	this.openFormDialog(config, 'new');
	// }

	// deleteItem(item: any) {
	// 	this.dataProcessing = true;
	// 	this.service.deleteAppointment(item.id).pipe(take(1)).subscribe({
	// 		next: () => {
	// 			this.dataProcessing = false;
	// 			let snackbarData: any = {
	// 				key: 'delete-item',
	// 				message: 'Xóa Thành Công'
	// 			};
	// 			this.showInfoSnackbar(snackbarData);
	// 			this.getDataItems();
	// 		}
	// 	})
	// }

	// onUpdateStatus(item: any, status: string) {
	// 	let dataJSON = {
	// 		status: status
	// 	}
	// 	this.dataProcessing = true;
	// 	this.service.updateAppointment(item.id, dataJSON).pipe(take(1)).subscribe({
	// 		next: () => {
	// 			this.dataProcessing = false;
	// 			let snackbarData: any = {
	// 				key: 'delete-item',
	// 				message: 'Xóa Thành Công'
	// 			};
	// 			this.showInfoSnackbar(snackbarData);
	// 			this.getDataItems();
	// 		}
	// 	})
	// }

	// onChangeData(item: any) {
	// 	let config: any = {};
	// 	config.data = {
	// 		item: item,
	// 		type: 'edit',
	// 		entityID: this.entityID,
	// 		entityType: this.entityType
	// 	};
	// 	this.openFormDialog(config, 'edit');
	// }

	// openFormDialog(config: any, target: string) {
	// 	config.disableClose = true;
	// 	config.panelClass = 'dialog-form-l';
	// 	config.maxWidth = '80vw';
	// 	config.autoFocus = true;
	// 	let dialogRef = this.dialog.open(AppointmentsInfoComponent, config);
	// 	dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
	// 		next: (res: any) => {
	// 			let snackbarData: any = {
	// 				key: ''
	// 			};
	// 			if (res === 'OK') {
	// 				snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
	// 				snackbarData.message = target === 'edit' ? 'Sửa Tu Sĩ Thành Công' : 'Thêm Tu Sĩ Thành Công';
	// 				this.showInfoSnackbar(snackbarData);
	// 				this.getDataItems();
	// 			}
	// 		}
	// 	});
	// }

	// drop(event: CdkDragDrop<unknown>) {
	// 	moveItemInArray(this.arrData, event.previousIndex, event.currentIndex);
	// }


	getDataItems() {
		let filter = '';
		if(this.entityType == 'organization'){
			filter = `entityId eq ${this.entityID} and entityType eq '${this.entityType}'`;
		}
		else if(this.entityType == 'clergy'){
			filter = `clergyID eq ${this.entityID}`;
		}

		let options = {
			filter: filter
		}
		this.arrData = [];
		this.dataProcessing = true;
		this.spinerLoading = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					this.arrData = res.value;
					for (let item of this.arrData) {
						if(this.entityType == 'organization'){
							item.name = item.clergyName;
						}
						else {

							item.name = item.entityName;
						}
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
						if (item && item.effectiveDate) {
							item._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(item.effectiveDate);
							item.effectiveDateView = item._effectiveDate.format('DD/MM/YYYY');
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

