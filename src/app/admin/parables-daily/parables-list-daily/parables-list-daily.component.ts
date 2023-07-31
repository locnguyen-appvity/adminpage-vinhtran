import { Component, } from '@angular/core';
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
import { ParableInfoDailyComponent } from '../parable-info-daily/parable-info-daily.component';

@Component({
	selector: 'app-parables-list-daily',
	templateUrl: './parables-list-daily.component.html',
	styleUrls: ['./parables-list-daily.component.scss']
})
export class ParableListDailyComponent extends TemplateGridApplicationComponent {

	public dataItems: any[] = [];
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
		this.getDataGridAndCounterApplications();
	}

	getFilter() {
		let filter = '';
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
			sort: 'date desc',
			// page: this.currentPageIndex + 1,
			// pageSize: this.pageSize,
			filter: filter
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getParablesDaily(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let total = res.total || 0;
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						// this.getAvatar(item);
						this.updateStatus(item);
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
						}
						if (item.date) {
							item._date = this.sharedService.convertDateStringToMoment(item.date, this.offset);
							item.dateView = item._date.format('DD/MM/YYYY hh:mm A');
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
	// {
	// 	"title": "Testing",
	// 	"photo": "abc",
	// 	"link": "abc",
	// 	"content": "acv",
	// 	"categoryIds": [],
	// 	"tags": [],
	// 	"metaDescription": "fddfd",
	// 	"metaTitle": "fd",
	// 	"topLevel": null,
	// 	"metaKeyword": "dfdfd",
	// 	"eventDate": null,
	// 	"visit": 0,
	// 	"slideId": null,
	// 	"created": "2023-06-03T00:00:00",
	// 	"modified": "2023-06-03T00:00:00",
	// 	"createdBy": null,
	// 	"modifiedBy": null,
	// 	"id": "92ed7836-3d0f-4d7b-999f-cae6fefd46e3"
	//thiếu status
	// }

	// getRowSelected(item: any) {
	// 	this.router.navigate([`/admin/parables-daily/info/${item.id}`]);
	// }

	getAvatar(dataItem: any) {
		if (this.isNullOrEmpty(dataItem.id)) {
			return;
		}
		// this.service.getAvatarListForEntityWithValue(dataItem.id, 'user').pipe(take(1)).subscribe({
		// 	next: (res: any) => {
		// 		if (res && res.value) {
		// 			dataItem.hasAvatar = true;
		// 			dataItem.pictureUrl = `data:image/jpeg;base64,${res.value.urlPatch}`;
		// 		}
		// 	}
		// })
	}

	addItem() {
		let config: any = {};
		config.data = {
			target: 'add'
		};
		this.openFormDialog(config, 'add');
	}

	deleteItem(item: any) {

	}

	getRowSelected(item: any) {
		let config: any = {};
		config.data = {
			target: 'edit',
			item: item
		};
		this.openFormDialog(config, 'edit');
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(ParableInfoDailyComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Tag Thành Công' : 'Thêm Tag Thành Công';
					this.showInfoSnackbar(snackbarData);
					if (target == 'edit') {
					}
					else {
					}
					this.getDataGridAndCounterApplications();
				}
				else if (res === 'Deleted') {
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
		this.service.updateParableDaily(item.id, dataJSON).pipe(take(1)).subscribe({
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
		this.service.deleteParableDaily(item.id).pipe(take(1)).subscribe({
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
		this.displayColumns = ['id', 'photo', 'status', 'name', 'code', 'quotation', 'date', 'created', 'moreActions'];
	}

}
