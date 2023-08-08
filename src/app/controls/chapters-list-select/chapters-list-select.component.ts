import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { GlobalSettings } from 'src/app/shared/global.settings';

@Component({
	selector: 'app-chapters-list-select',
	templateUrl: './chapters-list-select.component.html',
	styleUrls: ['./chapters-list-select.component.scss']
})
export class ChaptersListSelectComponent extends TemplateGridApplicationComponent {

	public entityID: string = '';
	public entityType: string = '';

	public dataItems: any[] = [];
	constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
		public dialogRef: MatDialogRef<ChaptersListSelectComponent>,
		public sharedService: SharedPropertyService,
		public linq: LinqService,
		public router: Router,
		public service: SharedService,
		public dialog: MatDialog,
		public snackbar: MatSnackBar,
		public store: Store<IAppState>
	) {
		super(sharedService, linq, store, service, snackbar);
		this.defaultSort = 'created desc';
		this.dataSettingsKey = 'chapters-list-select';
		if(this.dialogData.entityID){
			this.entityID = this.dialogData.entityID;
		}
		if(this.dialogData.entityType){
			this.entityType = this.dialogData.entityType;
		}
		this.getDataGridAndCounterApplications();
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityType)) {
			if (this.isNullOrEmpty(filter)) {
				filter = `(entityId eq ${this.entityID} and entityType eq '${this.entityType}')`;
			}
			else {
				filter = `(${filter}) and (entityId eq ${this.entityID} and entityType eq '${this.entityType}')`;
			}
		}
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(name, '${quick}') or contains(username, '${quick}')`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}

	getDataGridAndCounterApplications() {
		this.getDataGridApplications();
	}

	getDataGridApplications() {
		this.skip = this.currentPageIndex * this.pageSize;
		let filter = this.getFilter();
		let options = {
			skip: this.skip,
			top: this.pageSize,
			sort: 'created desc',
			filter: filter
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getChapters(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let total = res.total || 0;
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						// this.getAvatar(item);
						item.durationView = "Chưa xác định";
						if (item.duration) {
							item.durationView = item.duration;
						}
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						this.updateStatus(item);
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
						}
					}
				}
				this.gridDataChanges.data = this.dataItems;
				this.gridDataChanges.total = total;
				this.gridMessages = this.displayGridMessage(total);
				this.dataProcessing = false;
			}
		})
	}

	checkSingleItem($event: any, dataItem: any) {
		$event ? this.selection.select(dataItem) : this.selection.deselect(dataItem);
		this.updateItemSelectTemplate();
	}

	saveData() {
		this.dialogRef.close({ action: 'save', data: this.selection.selected });
	}

	closeDialog() {
		this.dialogRef.close({ action: 'cancel' });
	}

	override registerGridColumns() {
		this.displayColumns = ['id', 'photo', 'status', 'title', 'created'];
	}

}
