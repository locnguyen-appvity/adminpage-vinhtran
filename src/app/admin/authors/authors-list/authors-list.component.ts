import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { take, takeUntil } from 'rxjs';
import { AuthorInfoComponent } from '../author-info/author-info.component';
import { GlobalSettings } from 'src/app/shared/global.settings';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class FileNode {
	id: string;
	children: FileNode[];
	name: string;
	type: any;
	link: string;
	parentId: string;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
	constructor(
		public expandable: boolean,
		public name: string,
		public level: number,
		public type: any,
		public id: string,
		public link: string,
		public parentId: string
	) { }
}

@Component({
	selector: 'app-authors-list',
	templateUrl: './authors-list.component.html',
	styleUrls: ['./authors-list.component.scss'],
	// providers: [FileDatabase]
})
export class AuthorsListComponent extends ListItemBaseComponent {

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getDataItems();
	}

	onAddItemForNote(item: any) {
		let config: any = {};
		config.data = {
			target: 'add',
			parentItem: item
		};
		this.openFormDialog(config, 'add');
	}

	onAddItem() {
		let config: any = {};
		config.data = {
			target: 'add'
		};
		this.openFormDialog(config, 'add');
	}

	deleteItem(item: any) {
		this.dataProcessing = true;
		this.service.deleteAuthor(item.id).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				let snackbarData: any = {
					key: 'delete-item',
					message: 'Xóa Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status
		}
		this.dataProcessing = true;
		this.service.updateAuthor(item.id, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				let snackbarData: any = {
					key: 'delete-item',
					message: 'Xóa Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.getDataItems();
			}
		})
	}

	onChangeData(item: any) {
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
		let dialogRef = this.dialog.open(AuthorInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Author Thành Công' : 'Thêm Author Thành Công';
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

	// drop(event: CdkDragDrop<unknown>) {
	// 	moveItemInArray(this.arrData, event.previousIndex, event.currentIndex);
	// }

	getDataItems() {
		let filter = this.getFilter();
		let options = {
			sort: 'name asc',
			filter: filter
		}
		this.dataProcessing = true;
		this.spinerLoading = true;
		this.service.getAuthors(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					for (let item of res.value) {
						item.pictureUrl = './assets/icons/ic_person_48dp.svg'
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
					}
					this.arrData = res.value;
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

