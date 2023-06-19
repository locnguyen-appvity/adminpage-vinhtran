import { Component, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { UserInfoComponent } from '../dialogs/user-info/user-info.component';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends TemplateGridApplicationComponent {

	public dataItems: any[] = [];
	constructor(
		public sharedService: SharedPropertyService,
		public linq: LinqService,
		public router: Router,
		public service: SharedService,
		public dialog: MatDialog,
		public store: Store<IAppState>
	) {
		super(sharedService, linq, store, service);
		this.defaultSort = 'created desc';
		this.dataSettingsKey = 'user-list';

		this.dataItems = [
			{
				name: "Vinh Tran Duc",
				phoneNumber: "",
				userName: "vinhtran.it",
				role: "admin",
				roleName: "Quản trị viên",
				deactive: 0
			},
			{
				name: "Lam Nguyen",
				phoneNumber: "",
				userName: "lamnguyen.it",
				role: "editor",
				roleName: "Biên tập viên",
				deactive: 0
			}
		];
		this.gridMessages = "";
		this.gridDataChanges.data = this.dataItems;
		this.gridDataChanges.total = 2;
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(name, '${quick}') or contains(userName, '${quick}')`;
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
			filter: filter,
		};
		this.dataItems = [
			{
				name: "Vinh Tran Duc",
				phoneNumber: "",
				userName: "vinhtran.it",
				role: "Admin",
				deactive: 0
			},
			{
				name: "Lam Nguyen",
				phoneNumber: "",
				userName: "lamnguyen.it",
				role: "Editor",
				deactive: 0
			}
		];
		this.gridMessages = "";
		this.gridDataChanges.data = this.dataItems;
		this.gridDataChanges.total = 2;
		// this.dataProcessing = true;
		// this.service.getUsers(options).pipe(take(1)).subscribe({
		// 	next: (res: any) => {
		// 		let total = res.total;
		// 		if (res && res.value && res.value.length > 0) {
		// 			this.dataItems = res.value;
		// 			for (let item of this.dataItems) {
		// 				this.getAvatar(item);
		// 				// item.sexView = this.handleSex(item.sex);
		// 				// if (item.dateOfBirth) {
		// 				// 	item._dateOfBirth = this.sharedService.convertDateStringToMomentUTC_0(item.dateOfBirth);
		// 				// 	item.dateOfBirthView = item._dateOfBirth.format('DD/MM/YYYY');
		// 				// }
		// 			}
		// 		}
		// 		this.gridDataChanges.data = this.dataItems;
		// 		this.gridDataChanges.total = total;
		// 		this.gridMessages = this.sharedService.displayGridMessage(this.gridDataChanges.total);
		// 		this.dataProcessing = false;
		// 	}
		// })
	}

	getRowSelected(item: any) {
		let config: any = {};
		config.data = {
			type: 'edit',
			data: item
		};
		this.openFormDialog(config);
	}

	getAvatar(dataItem: any) {
		if (this.isNullOrEmpty(dataItem._id)) {
			return;
		}
		// this.service.getAvatarListForEntityWithValue(dataItem._id, 'user').pipe(take(1)).subscribe({
		// 	next: (res: any) => {
		// 		if (res && res.value) {
		// 			dataItem.hasAvatar = true;
		// 			dataItem.pictureUrl = `data:image/jpeg;base64,${res.value.urlPatch}`;
		// 		}
		// 	}
		// })
	}

	addUser() {
		let config: any = {};
		config.data = {
			type: 'new'
		};
		this.openFormDialog(config);
	}

	onDeactiveUser(item: any, deactive: number) {
		let dataJSON = {
			deactive: deactive
		}
		// this.service.updateUser(dataJSON, item._id).pipe(take(1)).subscribe({
		// 	next: () => {
		// 		this.selection.clear();
		// 		this.getDataGridAndCounterApplications();
		// 	}
		// })
	}

	changePassword(item: any) {
		let config: any = {};
		config.data = {
			type: 'update-password',
			data: item
		};
		this.openFormDialog(config);
	}

	openFormDialog(config: any) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '90vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(UserInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res && (res.action === 'add' || res.action === 'save')) {
					this.selection.clear();
					this.getDataGridAndCounterApplications();
				}
			}
		});
	}

	override registerGridColumns() {
		this.displayColumns = ['id', 'photo', 'deactive', 'name', 'phoneNumber', 'userName', 'role', 'actions'];
	}

	override getMenuViewColumns() {
		let menuViewColumns = [];
		menuViewColumns = [
			{
				title: 'Photo',
				column: 'photo',
				curChecked: true,
				prevChecked: true
			},
			{
				title: 'Trạng Thái',
				column: 'status',
				curChecked: true,
				prevChecked: true
			},
			{
				title: 'Họ và Tên',
				column: 'name',
				curChecked: true,
				prevChecked: true
			},
			{
				title: 'Số Điện Thoại',
				column: 'phoneNumber',
				curChecked: true,
				prevChecked: true
			},
			{
				title: 'Tên Đăng Nhập',
				column: 'userName',
				curChecked: true,
				prevChecked: true
			},
			{
				title: 'Quyền',
				column: 'role',
				curChecked: true,
				prevChecked: true
			}
		];
		return menuViewColumns;
	}

}
