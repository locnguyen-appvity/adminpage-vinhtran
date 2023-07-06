import { Component, Injectable, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { FolderInfoComponent } from '../../../controls/folder-info/folder-info.component';
import { Observable, take, takeUntil, of as observableOf } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';

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
		public name: string,
		public level: number,
		public type: any,
		public id: string,
		public link: string,
		public parent: string
	) { }
}

@Component({
	selector: 'app-folders-list',
	templateUrl: './folders-list.component.html',
	styleUrls: ['./folders-list.component.scss'],
	// providers: [FileDatabase]
})
export class FoldersListComponent extends ListItemBaseComponent {
	@Input() canEdit: boolean = false;
	treeControl: FlatTreeControl<FileFlatNode>;
	treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
	dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
	// expansion model tracks expansion state
	expansionModel = new SelectionModel<string>(true);
	expandTimeout: any;
	expandDelay = 1000;
	validateDrop = true;

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.noData = false;
		this.getDataItems();

		this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
			this._isExpandable, this._getChildren);
		this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
		// this.rebuildTreeForData(TREE_DATA);
		// database.dataChange.subscribe(data => this.rebuildTreeForData(data));
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

	getDataItems() {
		this.dataProcessing = true;
		this.service.getFolders().pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.data) {
					this.noData = false;
					this.arrData = res.data;
					let tempData = this.buildTree(res.data);
					// for (let i = 0; i < 5; i++) {
					// 	tempData.push(...tempData);
					// }
					this.rebuildTreeForData(tempData);
				}
				else {
					this.noData = true;
				}
				this.dataProcessing = false;
			}
		})
	}

	// getFolders() {
	// 	if (this.subscription['getFolders']) {
	// 		this.subscription['getFolders'].unsubscribe();
	// 	}
	// 	this.dataProcessing = true;
	// 	this.subscription['getFolders'] = this.service.getFolders().pipe(take(1)).subscribe((res: any) => {
	// 		this.dataProcessing = false;
	// 		if (res && res.data && res.data.length > 0) {
	// 			this.arrFolders = this.buildTree(res.data);
	// 		}
	// 		console.log("this.arrFolders.......", this.arrFolders);

	// 		if (this.subscription['getFolders']) {
	// 			this.subscription['getFolders'].unsubscribe();
	// 		}
	// 	})
	// }

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
		if (item && item.children && item.children.length > 0) {
			return;
		}
		this.dataProcessing = true;
		this.service.deleteFolder(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			this.getDataItems();
		})
	}


	//Tree
	transformer = (node: FileNode, level: number) => {
		return new FileFlatNode(!!node.children, node.name, level, node.type, node.id, node.link, node.parent);
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

