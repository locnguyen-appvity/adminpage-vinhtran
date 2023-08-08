import { Component, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { UserInfoComponent } from '../dialogs/user-info/user-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
		public store: Store<IAppState>,
		public snackbar: MatSnackBar,
	) {
		super(sharedService, linq, store, service, snackbar);
		this.defaultSort = 'created desc';
		this.dataSettingsKey = 'user-list';
		this.getDataGridAndCounterApplications();
		// this.dataItems = [
		// 	{
		// 		name: "Vinh Tran Duc",
		// 		phoneNumber: "",
		// 		username: "vinhtran.it",
		// 		role: "admin",
		// 		roleName: "Quản trị viên",
		// 		deactive: 0
		// 	},
		// 	{
		// 		name: "Lam Nguyen",
		// 		phoneNumber: "",
		// 		username: "lamnguyen.it",
		// 		role: "editor",
		// 		roleName: "Biên tập viên",
		// 		deactive: 0
		// 	}
		// ];
		// this.gridMessages = "";
		// this.gridDataChanges.data = this.dataItems;
		// this.gridDataChanges.total = 2;
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
		// this.skip = this.currentPageIndex * this.pageSize;
		// let filter = this.getFilter();
		// let options = {
		// 	skip: this.skip,
		// 	top: this.pageSize,
		// 	filter: filter,
		// };
		// this.dataItems = [
		// 	{
		// 		name: "Vinh Tran Duc",
		// 		phoneNumber: "",
		// 		username: "vinhtran.it",
		// 		role: "Admin",
		// 		deactive: 0
		// 	},
		// 	{
		// 		name: "Lam Nguyen",
		// 		phoneNumber: "",
		// 		username: "lamnguyen.it",
		// 		role: "Editor",
		// 		deactive: 0
		// 	}
		// ];
		this.gridMessages = "";
		this.gridDataChanges.data = this.dataItems;
		this.gridDataChanges.total = 2;
		this.dataProcessing = true;
		this.service.getUsers().pipe(take(1)).subscribe({
			next: (res: any) => {
				let total = res.total || 0;
				if (res && res.value && res.value.length > 0) {
					this.dataItems = res.value;
					// for (let item of this.dataItems) {
						// this.getAvatar(item);
						// item.sexView = this.handleSex(item.sex);
						// if (item.dateOfBirth) {
						// 	item._dateOfBirth = this.sharedService.convertDateStringToMomentUTC_0(item.dateOfBirth);
						// 	item.dateOfBirthView = item._dateOfBirth.format('DD/MM/YYYY');
						// }
					// }
				}
				this.gridDataChanges.data = this.dataItems;
				this.gridDataChanges.total = total;
				this.gridMessages = this.displayGridMessage(total);
				this.dataProcessing = false;
			}
		})
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

	addUser() {
		let config: any = {};
		config.data = {
			type: 'new'
		};
		this.openFormDialog(config);
	}

	onDeactiveUser(item: any, status: number) {
		let dataJSON = {
			status: status
		}
		// this.service.updateUser(dataJSON, item.id).pipe(take(1)).subscribe({
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
		this.displayColumns = ['id', 'photo', 'status', 'fullName', 'username', 'priority', 'actions'];
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
				column: 'fullName',
				curChecked: true,
				prevChecked: true
			},
			{
				title: 'Tên Đăng Nhập',
				column: 'username',
				curChecked: true,
				prevChecked: true
			},
			{
				title: 'Quyền',
				column: 'priority',
				curChecked: true,
				prevChecked: true
			}
		];
		return menuViewColumns;
	}

}
