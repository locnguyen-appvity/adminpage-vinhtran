import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { ClergyInfoComponent } from '../clergy-info/clergy-info.component';
import { Router } from '@angular/router';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { DomSanitizer } from '@angular/platform-browser';
import { LEVEL_CLERGY } from 'src/app/shared/data-manage';

@Component({
	selector: 'app-clergys-list',
	templateUrl: './clergys-list.component.html',
	styleUrls: ['./clergys-list.component.scss']
})
export class ClergysListComponent extends ListItemBaseComponent {

	public positionList: any[] = [];
	public levelList: any[] = LEVEL_CLERGY;

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public router: Router,
		private sanitizer: DomSanitizer,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getDataItems();
	}

	getAllData() {
		// forkJoin({ clergyPosition: this.getListClergyPosition(), clergyType: this.getListClergyType() }).pipe(take(1)).subscribe({
		// 	next: () => {
		// 		this.getDataItems();
		// 	}
		// })
	}

	getListClergyPosition() {
		this.positionList = [];
		// return this.service.getListClergyPosition().pipe(take(1), map((res: any) => {
		// 	if (res && res.value && res.value.length > 0) {
		// 		this.positionList = res.value;
		// 	}
		// }));
	}

	handleClergyPosition(item: any) {
		for (let position of this.positionList) {
			if (item.position == position.code) {
				item.positionName = position.name;
				return item;
			}
		}
		return item;
	}

	handleClergyLevel(item: any) {
		for (let type of this.levelList) {
			if (item.level == type.code) {
				item.typeName = type.name;
				return item;
			}
		}
		return item;
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(name), tolower('${quick}')) or contains(tolower(unsignedName), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}

	getDataItems() {
		this.spinerLoading = true;
		let options = {
			filter: this.getFilter(),
			sort: 'firstName asc'
		}
		this.service.getClergies(options).pipe(take(1)).subscribe((res: any) => {
			this.spinerLoading = false;
			this.arrData = [];
			if (res && res.value && res.value.length > 0) {
				let items = res.value;
				for (let item of items) {
					item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_priest.svg')
					if (item.photo) {
						item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
					}
					item = this.handleClergyLevel(item);
					item = this.handleClergyPosition(item);
				}
				this.arrData = items;
				this.noData = false;
			}
			else {
				this.noData = true;
			}

		})
	}

	onAddItem() {
		let config: any = {};
		config.data = {
			target: 'add'
		};
		this.openFormDialog(config, 'add');
	}

	onChangeData(item: any) {
		this.router.navigate([`/admin/manage/clergys/clergy/${item.id}`]);
	}

	onViewDetail(item: any){
		this.router.navigate([`/admin/clergy-view/${item.id}`]);
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-m';
		config.maxWidth = '80vw';
		config.height = 'auto';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(ClergyInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res && res.action == 'save') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Linh Mục Thành Công' : 'Thêm Linh Mục Thành Công';
					this.showInfoSnackbar(snackbarData);
					this.getDataItems();
				}
				else if (res && res.action == 'save-open-detail') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Linh Mục Thành Công' : 'Thêm Linh Mục Thành Công';
					this.showInfoSnackbar(snackbarData);
					if (res.data && res.data.id) {
						this.onChangeData(res.data);
					}
					else {
						this.getDataItems();
					}
				}
				else if (res && res.delete == 'delete') {
					this.getDataItems();
				}
			}
		});
	}

	deleteItem(item: any) {
		this.dataProcessing = true;
		this.service.deleteClergy(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			let snackbarData: any = {
				key: 'delete-item',
				message: 'Xóa Thành Công'
			};
			this.showInfoSnackbar(snackbarData);
			this.getDataItems();
		})
	}

	onDeactive(item: any) {
		let dataJSON = {
			status: 'inactive',
		}
		this.service.updateClergy(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'inactivate-item',
					message: 'Ẩn Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

	onActive(item: any) {
		let dataJSON = {
			status: 'publish',
		}
		this.service.updateClergy(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'activate-item',
					message: 'Hiện Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

}
