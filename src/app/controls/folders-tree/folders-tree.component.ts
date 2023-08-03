import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, take, takeUntil, of as observableOf } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ToastSnackbarAppComponent } from '../toast-snackbar/toast-snackbar.component';
import { FolderInfoComponent } from '../folder-info/folder-info.component';
import { DialogConfirmComponent } from '../confirm';

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
	parent: string;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
	constructor(
		public expandable: boolean,
		public hasChildren: boolean,
		public name: string,
		public level: number,
		public type: any,
		public id: string,
		public link: string,
		public parent: string
	) { }
}

@Component({
	selector: 'app-folders-tree',
	templateUrl: './folders-tree.component.html',
	styleUrls: ['./folders-tree.component.scss'],
	// providers: [FileDatabase]
})
export class FoldersTreeComponent extends SimpleBaseComponent {
	@Input() canEdit: boolean = false;
	@Input() target: string = 'multi';
	@Output() valueChanges: any = new EventEmitter();
	public treeControl: FlatTreeControl<FileFlatNode>;
	public treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
	public dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
	// expansion model tracks expansion state
	public expansionModel = new SelectionModel<string>(true);
	public expandTimeout: any;
	public expandDelay = 1000;
	public validateDrop = true;
	public noData: boolean = false;
	public spinerLoading: boolean = false;
	public nodeSelected: any;
	// public txtSearch: FormControl;
	// public searchValue: string = "";

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService);
		// this.txtSearch = new FormControl("");
		this.getDataItems();

		this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
			this._isExpandable, this._getChildren);
		this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

		// this.txtSearch.valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), takeUntil(this.unsubscribe)).subscribe({
		// 	next: (value: any) => {
		// 		if (this.sharedService.isChangedValue(this.searchValue, value)) {
		// 			this.doQuickSearch(value);
		// 		}
		// 	}
		// });
	}

	// clearSearch() {
	// 	this.txtSearch.setValue("");
	// }

	valueChangesFile(event: any) {
		this.valueChanges.emit(event);
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
			target: 'add',
			type: 'web'
		};
		this.openFormDialog(config, 'add');
	}

	onChangeData(item: any) {
		let config: any = {};
		config.data = {
			target: 'edit',
			item: item,
			type: 'web'
		};
		this.openFormDialog(config, 'edit');
	}

	openFormDialog(config: any, target: string) {
		config.disableClose = true;
		config.panelClass = 'dialog-form-l';
		config.maxWidth = '80vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(FolderInfoComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				let snackbarData: any = {
					key: ''
				};
				if (res === 'OK') {
					snackbarData.key = target === 'edit' ? 'saved-item' : 'new-item';
					snackbarData.message = target === 'edit' ? 'Sửa Danh Mục Thành Công' : 'Thêm Danh Mục Thành Công';
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

	showInfoSnackbar(dataInfo: any) {
		this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
			duration: 5000,
			data: dataInfo,
			horizontalPosition: 'start'
		});
	}

	getDataItems() {
		this.dataProcessing = true;
		this.spinerLoading = true;
		let options = {
			filter: "type ne 'mediafiles'"
		}
		this.service.getFolders(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					items = [{
						id: 'mydisk',
						children: this.buildTree(res.value),
						name: 'My Disk',
						type: 'folder',
						link: '',
						parent: ''
					}]
					this.nodeSelected = {
						id: 'mydisk',
						children: this.buildTree(res.value),
						name: 'My Disk',
						type: 'folder',
						link: '',
						parent: ''
					}
					this.expansionModel.select('mydisk');
				}
				else {
					this.noData = false;
				}
				this.rebuildTreeForData(items);
				this.spinerLoading = false;
				this.dataProcessing = false;
			}
		})
	}

	onSelectedFolder(node: any) {
		this.nodeSelected = node;
	}

	buildTree(items, parent = null) {
		const tree = [];
		items.forEach((item: any) => {
			if (item.parent === parent) {
				const children = this.buildTree(items, item.id);
				tree.push({
					id: item.id,
					children: children,
					name: item.name,
					type: '',
					link: '',
					parent: item.parent
				});
			}
		});

		return tree;
	}

	deleteItem(item: any) {
		let confirmMessage = `Nếu xóa thư mục <strong>${item.name}</strong> đồng nghĩa bạn sẽ <strong>xóa những files thuộc thư mục này</strong>. Bạn có chắc chắn xóa?`
		if (item && item.hasChildren) {
			confirmMessage = `Nếu xóa thư mục <strong>${item.name}</strong> đồng nghĩa bạn sẽ <strong>xóa những thư mục nằm trong và những files thuộc thư mục này</strong>. Bạn có chắc chắn xóa?`
		}
		let config: any = {
			data: {
				submitBtn: 'Xác nhận',
				cancelBtn: 'Hủy',
				confirmMessage: confirmMessage
			}
		};
		this.showDialogConfirm(config).pipe(take(1)).subscribe({
			next: (resConfirm: any) => {
				if (resConfirm && resConfirm.action == 'ok') {
					this.dataProcessing = true;
					this.service.deleteFolder(item.id).pipe(take(1)).subscribe(() => {
						this.dataProcessing = false;
						this.getDataItems();
					})
				}
			}
		})
	}

	showDialogConfirm(config: any) {
		return new Observable(obs => {
			config.disableClose = true;
			config.panelClass = 'dialog-form-l';
			config.maxWidth = '80vw';
			config.autoFocus = false;
			let dialogRef = this.dialog.open(DialogConfirmComponent, config);
			dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (res: any) => {
					obs.next(res);
					obs.complete();
				}
			});
		})
	}

	//Tree
	transformer = (node: FileNode, level: number) => {
		return new FileFlatNode(!!node.children, node.children.length > 0, node.name, level, node.type, node.id, node.link, node.parent);
	}
	private _getLevel = (node: FileFlatNode) => node.level;
	private _isExpandable = (node: FileFlatNode) => node.expandable;
	private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
	hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;


	/**
	 * This constructs an array of nodes that matches the DOM
	 */
	visibleNodes(): FileNode[] {
		const result = [];

		function addExpandedChildren(node: FileNode, expanded: string[]) {
			result.push(node);
			if (expanded.includes(node.id)) {
				node.children.map((child) => addExpandedChildren(child, expanded));
			}
		}
		this.dataSource.data.forEach((node) => {
			addExpandedChildren(node, this.expansionModel.selected);
		});
		return result;
	}

	rebuildTreeForData(data: any) {
		this.dataSource.data = data;
		this.expansionModel.selected.forEach((id) => {
			const node = this.treeControl.dataNodes.find((n) => n.id === id);
			this.treeControl.expand(node);
		});
	}

	/**
	 * Not used but you might need this to programmatically expand nodes
	 * to reveal a particular node
	 */
	private expandNodesById(flatNodes: FileFlatNode[], ids: string[]) {
		if (!flatNodes || flatNodes.length === 0) return;
		const idSet = new Set(ids);
		return flatNodes.forEach((node) => {
			if (idSet.has(node.id)) {
				this.treeControl.expand(node);
				let parent = this.getParentNode(node);
				while (parent) {
					this.treeControl.expand(parent);
					parent = this.getParentNode(parent);
				}
			}
		});
	}

	private getParentNode(node: FileFlatNode): FileFlatNode | null {
		const currentLevel = node.level;
		if (currentLevel < 1) {
			return null;
		}
		const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
		for (let i = startIndex; i >= 0; i--) {
			const currentNode = this.treeControl.dataNodes[i];
			if (currentNode.level < currentLevel) {
				return currentNode;
			}
		}
		return null;
	}

}

