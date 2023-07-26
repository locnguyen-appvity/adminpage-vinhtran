import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { EventInfoComponent } from '../event-info/event-info.component';
import { ANNIVERSARIES } from 'src/app/shared/data-manage';

@Component({
	selector: 'app-events-list',
	templateUrl: './events-list.component.html',
	styleUrls: ['./events-list.component.scss'],
})

export class EventsListComponent extends ListItemBaseComponent implements OnChanges {

	@Input() entityID: string = "";
	@Input() entityType: string = "";
	@Input() entityName: string = "";

	public dataDefault: any[] = ANNIVERSARIES;

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


	onCreateAuto() {
		if (this.dataDefault && this.dataDefault.length > 0) {
			let dataDefault = this.dataDefault.filter(it => this.sharedService.checkValueExistsInArray(this.entityType,it.includes) && it.hasAuto);
			if(dataDefault.length == 0){
				return;
			}
			this.dataProcessing = true;
			let sub = new BehaviorSubject(0);
			sub.subscribe({
				next: (index: number) => {
					if (index < dataDefault.length) {
						if (dataDefault[index]) {
							let valueForm = dataDefault[index];
							let dataJSON = {
								"entityID": this.entityID,
								"entityType": this.entityType,
								"name": valueForm.name,
								"day": "",
								"type": valueForm.type,
								"date": "",
								"description": "",
								"status": 'auto'
							}
							this.service.createAnniversary(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
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
						this.getDataItems();
						sub.complete();
						sub.unsubscribe();
					}

				}
			});
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
		this.service.deleteAnniversary(item.id).pipe(take(1)).subscribe({
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

	// onUpdateStatus(item: any, status: string) {
	// 	let dataJSON = {
	// 		status: status
	// 	}
	// 	this.dataProcessing = true;
	// 	this.service.updateAnniversary(item.id, dataJSON).pipe(take(1)).subscribe({
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
		let dialogRef = this.dialog.open(EventInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Sự Kiện Thành Công' : 'Thêm Sự Kiện Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
			}
		});
	}

	openNewTab(item: any, target: string){
		if(target == 'location'){
			window.open(`./#/admin/manage/${item.locationType}/detail/${item.locationID}`, '_blank');
		}
	}
	// drop(event: CdkDragDrop<unknown>) {
	// 	moveItemInArray(this.arrData, event.previousIndex, event.currentIndex);
	// }

	getDataItems() {
		let options = {
			filter: `type ne 'birth' and entityID eq ${this.entityID} and entityType eq '${this.entityType}'`,
			sort:'created asc'
		}
		this.arrData = [];
		this.dataProcessing = true;
		this.spinerLoading = true;
		this.service.getAnniversaries(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					this.arrData = res.value;
					for (let item of this.arrData) {
						item.dayView = item.day;
						if (item.date) {
							item._date = this.sharedService.convertDateStringToMomentUTC_0(item.date);
							item.dayView = item._date.format('DD/MM/YYYY');
						}
						if((item.type =='pho_te' || item.type =='linh_muc' || item.type =='baptize' || item.type =='confirmation') && !this.isNullOrEmpty(item.description)){
							item.descriptionView = `bới: ${item.description}`
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

}

