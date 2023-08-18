import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { forkJoin, take, takeUntil } from 'rxjs';
import { AppointmentsInfoComponent } from 'src/app/admin/manage/appointments/appointment-info/appointment-info.component';

@Component({
	selector: 'app-appointments-list-control',
	templateUrl: './appointments-list-control.component.html',
	styleUrls: ['./appointments-list-control.component.scss'],
})

export class AppointmentsListComponent extends ListItemBaseComponent implements OnChanges {

	@Input() entityID: string = "";
	@Input() clergyID: string = "";
	@Input() entityType: string = "";
	@Input() mode: string = "";
	public positionList: any[] = [];

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getPositions();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType'] || changes['clergyID'] || changes['mode']) {
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


	addItem() {
		let config: any = {
			data: {
				target: 'new',
				clergyID: this.clergyID
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = false;
		let dialogRef = this.dialog.open(AppointmentsInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = 'new-item';
					snackbarData.message = 'Thêm Giáo Xứ Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
			}
		});
	}

	getRowSelected(item: any, action: string) {
		if (action == 'auto') {
			let requets: any = {};

			if (!this.isNullOrEmpty(item.clergyID)) {
				let optionsClergy = {
					select: 'name,level,stName'
				}
				requets.clergy = this.service.getClergy(item.clergyID, optionsClergy);
			}
			if (!this.isNullOrEmpty(item.entityID)) {
				let options = {
					select: 'name,type'
				}
				if (this.sharedService.getTypeGetData(item.entityType) == 'organization') {
					requets.entity = this.service.getOrganization(item.entityID, options);
				}
				else {
					requets.entity = this.service.getGroup(item.entityID, options);
				}
			}
			if (Object.keys(requets).length > 0) {
				forkJoin(requets).pipe(takeUntil(this.unsubscribe)).subscribe({
					next: (res: any) => {
						let appointmentJSON: any = {}
						if (res.clergy) {
							appointmentJSON.clergyName = `${this.sharedService.getClergyLevel(res.clergy)} ${res.clergy.stName} ${res.clergy.name}`;
						}
						if (res.entity) {
							appointmentJSON.entityName = `${this.sharedService.updateNameTypeOrg(res.entity.type)} ${res.entity.name}`;
						}
						this.service.updateAppointment(item.id, appointmentJSON).pipe(take(1)).subscribe({
							next: () => {
								let snackbarData: any = {
									key: 'saved-item',
									message: 'Cập Nhật Bổ Nhiệm Thành Công'
								};
								this.showInfoSnackbar(snackbarData);
								this.getDataItems();
							}
						})
					}
				})
			}
		}
		else {
			if (this.isNullOrEmpty(this.entityID)) {
				let config: any = {
					data: {
						target: 'edit',
						// entityID: item.entityID,
						// entityName: item.entityName,
						// entityType: item.entityType,
						item: item,
						clergyID: item.clergyID,
						clergyName: item.clergyName,
						action: action
					}
				};
				config.disableClose = true;
				config.panelClass = 'dialog-form-l';
				config.maxWidth = '80vw';
				config.autoFocus = false;
				let dialogRef = this.dialog.open(AppointmentsInfoComponent, config);
				dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
					next: (res: any) => {
						let snackbarData: any = {
							key: ''
						};
						if (res === 'OK') {
							snackbarData.key = 'new-item';
							snackbarData.message = 'Thêm Bổ Nhiệm Thành Công';
							this.showInfoSnackbar(snackbarData);
							this.getDataItems();
						}
					}
				});
			}
		}
	}

	onDelete(item: any) {
		this.dataProcessing = true;
		this.service.deleteAppointment(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			let snackbarData: any = {
				key: 'delete-item',
				message: 'Xóa Thành Công'
			};
			this.showInfoSnackbar(snackbarData);
			this.getDataItems();
		})
	}

	openNewTab(element: any, target: string) {
		let link = '';
		if (target == 'clergy') {
			link = `./admin/clergy-view/${element.clergyID}`;
		}
		else {
			link = `${location.origin}/gppc/client/page/${element.entityType}/${element.entityID}`;
		}
		// this.router.navigate([]).then(() => {
		window.open(link, '_blank');
		// });
	}

	getDataItems() {
		let filter = '';
		if (this.mode == 'clergy') {
			filter = `clergyID eq ${this.clergyID}`;
		}
		else {
			filter = `entityId eq ${this.entityID} and entityType eq '${this.entityType}'`;
		}

		let options = {
			filter: filter,
			sort: 'effectiveDate desc'
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
						if (this.mode == 'clergy') {
							item.name = item.entityName;
						}
						else {
							item.name = item.clergyName;
						}
						item.statusView = this.sharedService.getClergyStatus(item.status);
						item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, 'code');
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

}

