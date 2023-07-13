import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { MediaFileInfoComponent } from '../../admin/media-files/media-file-info/media-file-info.component';
import { GlobalSettings } from 'src/app/shared/global.settings';

@Component({
	selector: 'app-media-files-list',
	templateUrl: './media-files-list.component.html',
	styleUrls: ['./media-files-list.component.scss']
})
export class MediaFilesListComponent extends TemplateGridApplicationComponent implements OnChanges {

	public dataItems: any[] = [];
	@Input() folder: any;
	@Input() mode: string = "list";
	@Input() hasSingleSelect: boolean = false;
	@Output() valueChanges: any = new EventEmitter();

	constructor(
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
		this.dataSettingsKey = 'user-list';
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['folder']) {
			this.getDataGridAndCounterApplications();
		}
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.folder) && this.folder.id != 'mydisk') {
			if (this.isNullOrEmpty(filter)) {
				filter = `folderId eq ${this.folder.id}`;
			}
			else {
				filter = `(${filter}) and (folderId eq ${this.folder.id})`;
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
			// page: this.currentPageIndex + 1,
			// pageSize: this.pageSize,
			filter: filter
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getMediaFiles(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let total = res.total || 0;
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						// this.getAvatar(item);
						if (!this.hasSingleSelect) {
							item.disabledItem = false;
						}
						item.durationView = "Chưa xác định";
						if (item.duration) {
							item.durationView = item.duration;
						}
						if (item.logo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.logo}`;
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
				this.gridMessages = this.sharedService.displayGridMessage(this.gridDataChanges.total);
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

	getRowSelected(item: any) {
		if (this.mode == 'list') {
			let config: any = {};
			config.data = {
				target: 'edit',
				item: item,
				folder: this.folder
			};
			this.openFormDialog(config, 'edit');
		}
		else {
			this.checkSingleItem(this.selection.isSelected(item) ? false : true, item);
		}
	}

	checkSingleItem($event: any, dataItem: any) {
		if (this.hasSingleSelect) {
			this.selection.clear();
		}
		$event ? this.selection.select(dataItem) : this.selection.deselect(dataItem);
		this.updateItemSelectTemplate();
		this.valueChanges.emit({ action: 'value-change', data: this.selection.selected });
	}

	addItem() {
		let config: any = {};
		config.data = {
			target: 'new',
			folder: this.folder
		};
		this.openFormDialog(config, 'new');
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(MediaFileInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Thành Công' : 'Thêm Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataGridAndCounterApplications();
				}
			}
		});
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status
		}
		this.dataProcessing = true;
		this.service.updateMediaFile(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.dataProcessing = false;
				this.selection.clear();
				this.getDataGridAndCounterApplications();
			}
		})
	}

	onDelete(item: any) {
		this.dataProcessing = true;
		this.service.deleteMediaFile(item.id).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				let snackbarData: any = {
					key: 'delete-item',
					message: 'Xóa Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.selection.clear();
				this.getDataGridAndCounterApplications();
			}
		})
	}

	override registerGridColumns() {
		this.displayColumns = ['id', 'photo', 'status', 'title', 'entityType', 'duration', 'created', 'moreActions'];
	}

}
