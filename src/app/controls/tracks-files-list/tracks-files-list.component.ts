import { AfterViewInit, Component, EventEmitter, Input, Output, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LinqService } from 'src/app/shared/linq.service';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TemplateGridApplicationComponent } from 'src/app/shared/template.grid.component';
import { parse } from 'rss-to-json';

@Component({
	selector: 'app-tracks-files-list',
	templateUrl: './tracks-files-list.component.html',
	styleUrls: ['./tracks-files-list.component.scss']
})
export class TracksFilesListComponent extends TemplateGridApplicationComponent implements AfterViewInit {

	public dataItems: any[] = [];
	public dataItemsCache: any[] = [];
	@Input() type: string = "soundcloud";//podbean
	@Input() target: string = 'multi';
	@Output() valueChanges: any = new EventEmitter();

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
		this.pageSize = 50;
	}

	ngAfterViewInit() {
		super.ngAfterViewInit();
		if (this.type == "soundcloud") {
			this.getsoundcloud();
		}
	}

	doQuickSearch(searchValue: string) {
		if (!this.isNullOrEmpty(searchValue)) {
			searchValue = searchValue.replace("'", "`");
		}
		this.searchValue = searchValue;
		// this.selection.clear();
		this.skip = 0;
		this.currentPageIndex = 0;
		if (this.paginator) {
			this.paginator.pageIndex = 0;
		}
		this.filter.quick = searchValue;
		this.getDataGridAndCounterApplications();
	}

	getsoundcloud() {
		parse('https://feeds.soundcloud.com/users/soundcloud:users:193166148/sounds.rss').then((res: any) => {
			if (res) {
				this.valueChanges.emit({
					action: 'loaded-title', data: {
						title: res.title,
						description: res.description
					}
				})
				if (res.items && res.items.length > 0) {
					this.dataItemsCache = res.items;
					this.getDataGridApplications();
				}
			}
		});
	}

	_filter(value: string, dataItems: any, key: string) {
		if (this.isNullOrEmpty(value)) {
			return dataItems;
		}
		else if (dataItems && dataItems.length > 0) {
			return dataItems.filter(group => (group[key].toLowerCase()).includes(value.toLowerCase()));
		}
		else {
			return [];
		}
	}

	getDataGridAndCounterApplications() {
		this.getDataGridApplications();
	}

	getDataGridApplications() {
		this.skip = this.currentPageIndex * this.pageSize;
		let dataItems = [];
		let items = [];
		let total = 0;
		if (this.dataItemsCache && this.dataItemsCache.length > 0) {
			dataItems = this._filter(this.searchValue, this.dataItemsCache, 'title');
			if (dataItems && dataItems.length > 0) {
				total = dataItems.length;
				let top = this.skip + this.pageSize > dataItems.length ? dataItems.length : this.skip + this.pageSize;
				if (this.skip < dataItems.length) {
					dataItems = dataItems.slice(this.skip, top);
				}
			}
		}
		if (dataItems && dataItems.length > 0) {
			for (let item of dataItems) {
				let url = "";
				let length = 0;
				if (item.enclosures && item.enclosures[0]) {
					url = item.enclosures[0] ? item.enclosures[0].url : "";
					length = item.enclosures[0] ? Number(item.enclosures[0].length) : 0;
				}
				if (!this.isNullOrEmpty(url)) {
					if (item.created) {
						item._created = this.convertDateNumberToMoment(item.created);
						item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
					}
					items.push({
						entityType: "soundcloud",
						entityId: item.id,
						title: item.title,
						content: item.content,
						logo: item.itunes_image ? item.itunes_image.href : "",
						mediaUrl: url,
						playerUrl: url,
						permalinkUrl: url,
						duration: length,
						durationView: length,
						folderId: "",
						embed: "",
						isAuto: "true",
						status: 'active',
						createdView: item.createdView
					})
				}
			}
		}
		this.dataItems = items;
		this.gridDataChanges.data = this.dataItems;
		this.gridDataChanges.total = total;
		this.gridMessages = this.sharedService.displayGridMessage(this.gridDataChanges.total);
	}

	convertDateNumberToMoment(data: number) {
		if (data > 0) {
			let date: any = this.sharedService.moment(data * 1000);//* 1000
			return date;
		};
		return null;
	}

	getRowSelected(item: any) {
		this.checkSingleItem(this.selection.isSelected(item) ? false : true, item);
	}

	checkSingleItem($event: any, dataItem: any) {
		if (this.target == 'single') {
			this.selection.clear();
		}
		$event ? this.selection.select(dataItem) : this.selection.deselect(dataItem);
		this.updateItemSelectTemplate();
		this.valueChanges.emit({ action: 'value-change', data: this.selection.selected });
	}

	override registerGridColumns() {
		this.displayColumns = ['id', 'photo', 'status', 'title', 'entityType', 'duration', 'created'];
	}

}
