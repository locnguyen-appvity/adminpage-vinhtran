import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CategoryInfoComponent } from '../category-info/category-info.component';
import { Observable, take, takeUntil, of as observableOf } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
	selector: 'app-categories-list',
	templateUrl: './categories-list.component.html',
	styleUrls: ['./categories-list.component.scss'],
	// providers: [FileDatabase]
})
export class CategoriesListComponent extends ListItemBaseComponent {

	treeControl: FlatTreeControl<FileFlatNode>;
	treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
	dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
	// expansion model tracks expansion state
	expansionModel = new SelectionModel<string>(true);
	dragging = false;
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
		let dialogRef = this.dialog.open(CategoryInfoComponent, config);
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

	// drop(event: CdkDragDrop<unknown>) {
	// 	moveItemInArray(this.arrData, event.previousIndex, event.currentIndex);
	// }

	getDataItems() {
		this.arrData = [];
		let filter = this.getFilter();
		let options = {
			sort: 'name asc, order asc',
			filter: filter
		}
		this.dataProcessing = true;
		this.spinerLoading = true;
		this.service.getCategories(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value && res.value.length > 0) {
					this.noData = false;
					this.arrData = res.value;
					let tempData = this.buildTreeData(res.value);
					// for (let i = 0; i < 5; i++) {
					// 	tempData.push(...tempData);
					// }
					this.rebuildTreeForData(tempData);
				}
				else {
					this.noData = true;
				}
				this.dataProcessing = false;
				this.spinerLoading = false;
			}
		})
	}

	buildTreeData(items: any) {
		if (items && items.length > 0) {
			return this.getDataChildren(items, '', 0);

			// items.filter(it => it.level == 1).map(it => {
			// 	return {
			// 		id: it.id,
			// 		children: this.getDataChildren(items,it.parentId,2),
			// 		name: it.name,
			// 		type: '',
			// 		link: it.link,
			// 		parentId: it.parentId
			// 	}
			// });
			// let dataLevelTwo = items.filter(it => it.level == 2);
			// let dataLevelThree = items.filter(it => it.level == 3);
		}
		return [];
	}

	getDataChildren(items: any, parentId: string, level: number = 0) {
		if (level < 4) {
			if (items && items.length > 0) {
				if (level == 0) {
					return items.filter(it => it.level == level).map(it => {
						return {
							id: it.id,
							children: this.getDataChildren(items, it.id, level + 1),
							name: it.name,
							type: '',
							link: it.link,
							parentId: it.parentId
						}
					});
				}
				else if (level == 3) {
					return items.filter(it => (it.parentId == parentId && it.level == level)).map(it => {
						return {
							id: it.id,
							name: it.name,
							type: '',
							link: it.link,
							parentId: it.parentId
						}
					});
				}
				else {
					return items.filter(it => (it.parentId == parentId && it.level == level)).map(it => {
						return {
							id: it.id,
							children: this.getDataChildren(items, it.id, level + 1),
							name: it.name,
							type: '',
							link: it.link,
							parentId: it.parentId
						}
					});
				}
			}
		}
		return [];
	}

	deleteItem(item: any) {
		if (item && item.children && item.children.length > 0) {
			return;
		}
		this.dataProcessing = true;
		this.service.deleteCategory(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			this.getDataItems();
		})
	}


	//Tree
	transformer = (node: FileNode, level: number) => {
		return new FileFlatNode(!!node.children, node.name, level, node.type, node.id, node.link, node.parentId);
	}
	private _getLevel = (node: FileFlatNode) => node.level;
	private _isExpandable = (node: FileFlatNode) => node.expandable;
	private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
	hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

	// DRAG AND DROP METHODS

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

	/**
	 * Handle the drop - here we rearrange the data based on the drop event,
	 * then rebuild the tree.
	 * */
	drop(event: CdkDragDrop<string[]>) {
		// console.log('origin/destination', event.previousIndex, event.currentIndex);

		// ignore drops outside of the tree
		if (!event.isPointerOverContainer) return;

		// construct a list of visible nodes, this will match the DOM.
		// the cdkDragDrop event.currentIndex jives with visible nodes.
		// it calls rememberExpandedTreeNodes to persist expand state
		const visibleNodes = this.visibleNodes();

		// deep clone the data source so we can mutate it
		const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

		// recursive find function to find siblings of node
		function findNodeSiblings(arr: Array<any>, id: string): Array<any> {
			let result, subResult;
			arr.forEach((item, i) => {
				if (item.id === id) {
					result = arr;
				} else if (item.children) {
					subResult = findNodeSiblings(item.children, id);
					if (subResult) result = subResult;
				}
			});
			return result;

		}

		// determine where to insert the node
		const nodeAtDest = visibleNodes[event.currentIndex];
		const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
		if (!newSiblings) return;
		const insertIndex = newSiblings.findIndex(s => s.id === nodeAtDest.id);

		// remove the node from its old place
		const node = event.item.data;
		const siblings = findNodeSiblings(changedData, node.id);
		const siblingIndex = siblings.findIndex(n => n.id === node.id);
		const nodeToInsert: FileNode = siblings.splice(siblingIndex, 1)[0];
		if (nodeAtDest.id === nodeToInsert.id) return;

		// ensure validity of drop - must be same level
		const nodeAtDestFlatNode = this.treeControl.dataNodes.find((n) => nodeAtDest.id === n.id);
		if (this.validateDrop && nodeAtDestFlatNode.level !== node.level) {
			alert('Items can only be moved within the same level.');
			return;
		}

		// insert node 
		newSiblings.splice(insertIndex, 0, nodeToInsert);

		// rebuild tree with mutated data
		this.rebuildTreeForData(changedData);
	}

	/**
	 * Experimental - opening tree nodes as you drag over them
	 */
	dragStart() {
		this.dragging = true;
	}
	dragEnd() {
		this.dragging = false;
	}
	dragHover(node: FileFlatNode) {
		if (this.dragging) {
			clearTimeout(this.expandTimeout);
			this.expandTimeout = setTimeout(() => {
				this.treeControl.expand(node);
			}, this.expandDelay);
		}
	}
	dragHoverEnd() {
		if (this.dragging) {
			clearTimeout(this.expandTimeout);
		}
	}

	/**
	 * The following methods are for persisting the tree expand state
	 * after being rebuilt
	 */

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

