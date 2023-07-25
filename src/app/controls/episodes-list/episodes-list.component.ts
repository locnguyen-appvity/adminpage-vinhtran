import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { EpisodesListSelectComponent } from '../episodes-list-select/episodes-list-select.component';

@Component({
	selector: 'app-episodes-list-control',
	templateUrl: './episodes-list.component.html',
	styleUrls: ['./episodes-list.component.scss']
})
export class EpisodesListControlComponent extends TemplateGridApplicationComponent implements AfterViewInit, OnChanges {

	// @Input() mode: string = 'list';
	@Input() entityID: string = '';
	@Input() entityType: string = '';
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
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID'] || changes['entityType']) {
			if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityType)) {
				this.getDataGridAndCounterApplications();
			}
		}
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.entityID) && !this.isNullOrEmpty(this.entityType)) {
			if (this.isNullOrEmpty(filter)) {
				filter = `(entityId eq ${this.entityID} and entityType eq '${this.entityType}')`;
			}
			else {
				filter = `(${filter}) and (entityId eq ${this.entityID} and entityType eq '${this.entityType}')`;
			}
		}
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(name, '${quick}') or contains(username, '${quick}')`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = `(${filter}) and (${quickSearch})`;
			}
		}
		return filter;
	}

	ngAfterViewInit() {
		super.ngAfterViewInit();
		if (this.entityType == "chapter" || this.entityType == "book") {
			// this.displayColumns = ['id', 'photo', 'status', 'title', 'created'];
		}
		else {
			this.getDataGridAndCounterApplications();
		}
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
			sort: 'created desc',
			// page: this.currentPageIndex + 1,
			// pageSize: this.pageSize,
			filter: filter
		};
		this.dataItems = [];
		this.dataProcessing = true;
		this.service.getEpisodes(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let total = res.total || 0;
				if (res && res.value) {
					this.dataItems = res.value;
					for (let item of this.dataItems) {
						// this.getAvatar(item);
						item.disabledItem = false;
						item.durationView = "Chưa xác định";
						if (item.duration) {
							item.durationView = item.duration;
						}
						if (item.entityId) {
							item.includesView = item.entityId;
						}
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						this.updateStatus(item);
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
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

	getRowSelected(item: any) {
		if (this.entityType !== "chapter" && this.entityType !== "book") {
			this.router.navigate([`/admin/episodes/episode-info/${item.id}`]);
		}
	}

	addItem() {
		if (this.entityType == "chapter" || this.entityType == "book") {
			this.onSelectMeida();
		}
		else {
			this.router.navigate(['/admin/episodes/episode-info']);
		}
	}

	onSelectMeida() {
		let config: any = {
			data: {
				filter: `entityId eq null and entityType eq ''`
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-xxl';
		config.maxWidth = '90vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(EpisodesListSelectComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res && res.action == 'save' && res.data && res.data.length > 0) {
					let requets: Observable<any>[] = [];
					for (let item of res.data) {
						let dataJSON = {
							"entityId": this.entityID,
							"entityType": this.entityType
						}
						requets.push(this.service.updateEpisode(item.id, dataJSON));
					}

					forkJoin(requets).pipe(take(1)).subscribe({
						next: () => {
							let snackbarData: any = {
								key: 'saved-item',
								message: 'Thêm Thành Công'
							};
							this.showInfoSnackbar(snackbarData);
							this.selection.clear();
							this.getDataGridAndCounterApplications();
						}
					})
				}
			}
		})
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status
		}
		this.dataProcessing = true;
		this.service.updateEpisode(item.id, dataJSON).pipe(take(1)).subscribe({
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
		let request = this.service.deleteEpisode(item.id);
		if (this.entityType == "chapter" || this.entityType == "book") {
			let dataJSON = {
				"entityId": null,
				"entityType": ""
			}
			request = this.service.updateEpisode(item.id, dataJSON);
		}
		request.pipe(take(1)).subscribe({
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
		this.displayColumns = ['id', 'photo', 'status', 'title', 'includes', 'created', 'moreActions'];
	}

}
