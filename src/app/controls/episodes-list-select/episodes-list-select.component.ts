import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { GlobalSettings } from 'src/app/shared/global.settings';

@Component({
	selector: 'app-episodes-list-select',
	templateUrl: './episodes-list-select.component.html',
	styleUrls: ['./episodes-list-select.component.scss']
})
export class EpisodesListSelectComponent extends TemplateGridApplicationComponent {

	public dataItems: any[] = [];
	public filter: string = "";
	public title: string = "Chọn Media File";
	constructor(
		public linq: LinqService,
		public service: SharedService,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
		public dialogRef: MatDialogRef<EpisodesListSelectComponent>,
		public sharedService: SharedPropertyService,
		public store: Store<IAppState>,
		public snackbar: MatSnackBar,
	) {
		super(sharedService, linq, store, service, snackbar);
		this.defaultSort = 'created desc';
		this.dataSettingsKey = 'user-list';
		if (this.dialogData.filter) {
			this.filter = this.dialogData.filter;
		}
		this.getDataGridAndCounterApplications();
	}


	getFilter() {
		let filter = this.filter;
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(name, '${quick}') or contains(username, '${quick}')`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = `(${filter}) and (${quickSearch})`;
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
		this.service.getEpisodes(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let total = res.total || 0;
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						item.disabledItem = false;
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

	updateStatus(item: any) {
		switch (item.status) {
			case 'publish':
			case 'active':
				item.statusView = "Đã Xuất Bản";
				item.statusClass = "approved-label";
				break;
			case 'inactive':
				item.statusView = "Tạm Ẩn"
				item.statusClass = "rejected-label";
				break;
			default:
				item.statusClass = "pending-label";
				item.statusView = "Lưu Nháp"
				break;
		}
	}

	checkSingleItem($event: any, dataItem: any) {
		$event ? this.selection.select(dataItem) : this.selection.deselect(dataItem);
		this.updateItemSelectTemplate();
	}

	override registerGridColumns() {
		this.displayColumns = ['id', 'photo', 'status', 'title', 'created'];
	}

	saveData() {
		this.dialogRef.close({ action: 'save', data: this.selection.selected });
	}

	closeDialog() {
		this.dialogRef.close({ action: 'cancel' });
	}

}
