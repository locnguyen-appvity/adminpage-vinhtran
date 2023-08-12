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
import { NotificationPostInfoComponent } from '../notification-post-info/notification-post-info.component';
import { CommonUtility } from 'src/app/shared/common.utility';

@Component({
	selector: 'app-notification-post-list',
	templateUrl: './notification-post-list.component.html',
	styleUrls: ['./notification-post-list.component.scss']
})
export class NotificationPostsListComponent extends TemplateGridApplicationComponent {

	public dataItems: any[] = [];
	public dateFilter = {
		fromDate: '',
		toDate: ''
	}

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
		let dateFilter = CommonUtility.getFilterDate(
			{
				key: 'month',
				date: {
					fromDate: this.sharedService.moment(),
					toDate: "",
				}
			})
		this.dateFilter.fromDate = CommonUtility.getDateFormatString(dateFilter.fromDate, "YYYY-MM-DD")
		this.dateFilter.toDate = CommonUtility.getDateFormatString(dateFilter.toDate, "YYYY-MM-DD")

		this.getDataGridAndCounterApplications();
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(title, '${quick}')`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		let filterDate = "";
		if (!this.isNullOrEmpty(this.dateFilter.fromDate)) {
			filterDate = `startDate eq ${this.dateFilter.fromDate}`;
			if (!this.isNullOrEmpty(this.dateFilter.toDate)) {
				filterDate = `startDate ge ${this.dateFilter.fromDate} and startDate le ${this.dateFilter.toDate}`;
			}
		}
		else if (!this.isNullOrEmpty(this.dateFilter.toDate)) {
			filterDate = `startDate eq ${this.dateFilter.toDate}`;
		}
		if (!this.isNullOrEmpty(filterDate)) {
			if (this.isNullOrEmpty(filter)) {
				filter = filterDate;
			}
			else {
				filter = `(${filter}) and (${filterDate})`;
			}
		}

		return filter;
	}

	onChangeDate(event: any) {
		if (event && event.action == "date-change") {
			let data = event.data;
			this.dateFilter.fromDate = (data && data.date) ? data.date.fromDate : "";
			this.dateFilter.toDate = (data && data.date) ? data.date.toDate : "";
			this.getDataGridAndCounterApplications();
		}
	}

	getDataGridAndCounterApplications() {
		this.getDataGridApplications();
	}

	getDataGridApplications() {
		this.skip = this.currentPageIndex * this.pageSize;
		let options = {
			skip: this.skip,
			top: this.pageSize,
			// sort: 'date desc',
			// page: this.currentPageIndex + 1,
			// pageSize: this.pageSize,
			filter: this.getFilter()
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getNotificationPosts(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let total = res.total || 0;
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						// this.getAvatar(item);
						// this.updateStatus(item);
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
						}
						if (item.startDate) {
							item._startDate = this.sharedService.convertDateStringToMomentUTC_0(item.startDate);
							item.startDateView = this.sharedService.formatDate(item._startDate);
						}
						if (item.endDate) {
							item._endDate = this.sharedService.convertDateStringToMomentUTC_0(item.endDate);
							item.endDateView = this.sharedService.formatDate(item._endDate);
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
		let dialogRef = this.dialog.open(NotificationPostInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Thành Công' : 'Thêm Thành Công';
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
		this.service.updateNotificationPost(item.id, dataJSON).pipe(take(1)).subscribe({
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
		this.service.deleteNotificationPost(item.id).pipe(take(1)).subscribe({
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
		this.displayColumns = ['id', 'title', 'metaDescription', 'startDate', 'endDate', 'created', 'moreActions'];
	}

}
