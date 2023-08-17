import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SaintInfoComponent } from './saint-info/saint-info.component';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SAINTS_DATA } from 'src/app/shared/data-manage';
import { Router } from '@angular/router';

@Component({
	selector: 'se-saints',
	templateUrl: './saints.component.html',
	styleUrls: ['./saints.component.scss']
})
export class SaintsComponent extends ListItemBaseComponent {
	public type: string = "thanh";
	public title:string = "Các Thánh";

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public router: Router,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		if (this.router.url.includes('/le')) {
			this.type = "le";
			this.title = "Ngày Lễ"
		}
		this.getDataItems();
	}

	getFilter() {
		let filter = `type eq '${this.type}'`;
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(${this.searchKey}), tolower('${quick}')) or contains(tolower(anniversary), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = `(${filter}) and (${quickSearch})`;
			}
		}
		return filter;
	}

	getDataItems() {
		this.spinerLoading = true;
		let options = {
			filter: this.getFilter(),
			sort: 'name asc',
			// select: 'id,abbreviation,code,anniversary,description,name,subtitle,status,content'
		}
		this.service.getSaints(options).pipe(take(1)).subscribe((res: any) => {
			this.arrData = [];
			this.spinerLoading = false;
			if (res && res.value && res.value.length > 0) {
				let items = res.value;
				for (let item of items) {
					item._name = `${this.sharedService.updateNameTypeSaint(item.type)} ${item.name}`;
					switch (item.status) {
						case 'active':
							item.statusTooltip = 'Hiện';
							item.statusIcon = 'ic_toggle_on';
							item.class = 'active-status';
							break;
						case 'inactive':
							item.statusTooltip = 'Ẩn';
							item.statusIcon = 'ic_toggle_off';
							item.class = 'inactive-status';
							break;
					}
				}
				this.arrData = items;
				this.noData = false;
			}
			else {
				this.noData = true;
			}

		})
	}

	deleteItem(item: any) {
		this.dataProcessing = true;
		this.service.deleteSaint(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			let snackbarData: any = {
				key: 'delete-item',
				message: 'Xóa Thành Công'
			};
			this.showInfoSnackbar(snackbarData);
			this.getDataItems();
		})
	}

	onAddItem() {
		let config: any = {};
		config.data = {
			target: 'add',
			type: this.type
		};
		this.openFormDialog(config, 'add');
	}

	onAddAuto() {
		// this.updateAddAuto(this.arrData);
		let dataDefault = SAINTS_DATA;
		if (dataDefault && dataDefault.length > 0) {
			this.spinerLoading = true;
			this.dataProcessing = true;
			let sub = new BehaviorSubject(0);
			sub.subscribe({
				next: (index: number) => {
					if (index < dataDefault.length) {
						if (dataDefault[index]) {
							let valueForm = dataDefault[index];
							let dataJSON = {
								name: valueForm.name,
								code: valueForm.code,
								type: "thanh",
								status: 'active'
							}
							this.service.createSaint(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
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
						this.spinerLoading = false;
						this.getDataItems();
						sub.complete();
						sub.unsubscribe();
					}

				}
			});
		}
	}

	updateAddAuto(dataDefault) {
		if (dataDefault && dataDefault.length > 0) {
			this.spinerLoading = true;
			this.dataProcessing = true;
			let sub = new BehaviorSubject(0);
			sub.subscribe({
				next: (index: number) => {
					if (index < dataDefault.length) {
						if (dataDefault[index]) {
							let valueForm = dataDefault[index];
							let dataJSON = {
								abbreviation: valueForm.name
							}
							this.service.updateSaint(valueForm.id, dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe({
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
						this.spinerLoading = false;
						this.getDataItems();
						sub.complete();
						sub.unsubscribe();
					}

				}
			});
		}
	}

	onChangeData(item: any) {
		let config: any = {};
		config.data = {
			target: 'edit',
			item: item,
			type: this.type
		};
		this.openFormDialog(config, 'edit');
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-xl';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(SaintInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res === 'OK') {
					let snackbarData: any = {
						key: ''
					};
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Thánh Thành Công' : 'Thêm Thánh Thành Công';
					this.showInfoSnackbar(snackbarData);
					if (target == 'edit') {
					}
					else {
					}
					this.getDataItems();
				}
				else if (res === 'Deleted') {
					this.getDataItems();
				}
			}
		});
	}

}
