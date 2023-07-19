import { Component, ViewChild } from '@angular/core';
import { SimpleBaseComponent } from '../shared/simple.base.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharedPropertyService } from '../shared/shared-property.service';
import { distinctUntilChanged, share, shareReplay, takeUntil } from 'rxjs';
import { AboutComponent } from '../controls/about';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends SimpleBaseComponent {

	public sidenav: MatSidenav;
	@ViewChild('sidenav') set elemOnHTML(elemOnHTML: MatSidenav) {
		if (!!elemOnHTML) {
			this.sidenav = elemOnHTML;
		}
	}

	public alertsPanel: any;
	@ViewChild('alertsPanel') set alertsPanelOnHTML(alertsPanelOnHTML: MatSidenav) {
		if (!!alertsPanelOnHTML) {
			this.alertsPanel = alertsPanelOnHTML;
		}
	}

	// mobileQuery: MediaQueryList;
	// private _mobileQueryListener: (() => void);
	public showLoadingProfileInfo: boolean = false;
	public loadingRouteConfig: boolean = false;
	public title: string = "GIÁO PHẬN PHÚ CƯỜNG";
	public description: string = "Truyền Thông Trong Chúa Kitô";
	public currentUser: any = {
		id: "",
		name: "Admin",
		pictureUrl: './assets/icons/ic_person_48dp.svg'
	};
	public iNotificationMyAccount: number = 10;
	public toggleMyAccountPanel: boolean = false;
	public pictureUrl = './assets/images/logo-for-web.png';
	public isSettings: boolean = false;

	constructor(
		public override sharedService: SharedPropertyService,
		public router: Router,
		public dialog: MatDialog,
	) {
		super(sharedService);
		this.getVerifyAccessToken();
		this.actionsAsync();
		this.router.events.pipe(shareReplay({
			bufferSize: 1,
			refCount: true,
		}), takeUntil(this.unsubscribe)).subscribe((event: any) => {
			this.getTitle();
		});
	}

	getVerifyAccessToken() {
		let accessToken = localStorage.getItem('accessToken');
		if (this.isNullOrEmpty(accessToken)) {
			this.router.navigate(['/login']);
		}

	}

	getTitle() {
		if(this.router.url.includes('/admin/categories-list')){
			this.title = "Danh Mục";
		}
		else if(this.router.url.includes('/tags')){
			this.title = "TAGS";
		}
		else if(this.router.url.includes('/admin/posts')){
			this.title = "BÀI VIẾT";
		}
		else if(this.router.url.includes('/admin/users-list')){
			this.title = "NGƯỜI DÙNG";
		}
		else if(this.router.url.includes('/admin/parables')){
			this.title = "LỜI CHÚA";
		}
		else if(this.router.url.includes('/admin/contemplations')){
			this.title = "SUY NIỆM";
		}
	}

	actionsAsync() {
		this.sharedService.dataItemObs.pipe(distinctUntilChanged(), share(), shareReplay({
			bufferSize: 1,
			refCount: true,
		}), takeUntil(this.unsubscribe)).subscribe((res: any) => {
			if (res.action === 'side-nav-close') {
				this.sidenav.close();
			}
			else if (res.action === 'alerts-panel-nav-close') {
				if (this.alertsPanel) {
					this.alertsPanel.close();
				}
			}
			else if (res.action === 'alerts-panel-nav-toggle') {
				if (this.alertsPanel) {
					this.alertsPanel.toggle();
				}
			}
			else if (res.action === 'side-nav-toggle') {
				this.sidenav.toggle();
			}
		})
	}

	aboutProduct() {
		let dialogRef = this.dialog.open(AboutComponent, {
			height: 'auto',
			panelClass: 'dialog-form-xs',
			autoFocus: false
		});
		dialogRef.afterClosed().pipe(shareReplay({
			bufferSize: 1,
			refCount: true,
		}), takeUntil(this.unsubscribe)).subscribe({
			next: () => {
			}
		});
	}

	toggleSetting() {
		this.isSettings = !this.isSettings;
	}

	// "value": [
	// 	{
	// 	  "name": "Categories",
	// 	  "kind": "EntitySet",
	// 	  "url": "Categories"
	// 	},
	// 	{
	// 	  "name": "Layouts",
	// 	  "kind": "EntitySet",
	// 	  "url": "Layouts"
	// 	},
	// 	{
	// 	  "name": "Tags",
	// 	  "kind": "EntitySet",
	// 	  "url": "Tags"
	// 	},
	// 	{
	// 	  "name": "Posts",
	// 	  "kind": "EntitySet",
	// 	  "url": "Posts"
	// 	},
	// 	{
	// 	  "name": "Files",
	// 	  "kind": "EntitySet",
	// 	  "url": "Files"
	// 	},
	// 	{
	// 	  "name": "Folders",
	// 	  "kind": "EntitySet",
	// 	  "url": "Folders"
	// 	},
	// 	{
	// 	  "name": "FolderFiles",
	// 	  "kind": "EntitySet",
	// 	  "url": "FolderFiles"
	// 	},
	// 	{
	// 	  "name": "Authors",
	// 	  "kind": "EntitySet",
	// 	  "url": "Authors"
	// 	},
	// 	{
	// 	  "name": "Widgets",
	// 	  "kind": "EntitySet",
	// 	  "url": "Widgets"
	// 	},
	// 	{
	// 	  "name": "Websites",
	// 	  "kind": "EntitySet",
	// 	  "url": "Websites"
	// 	},
	// 	{
	// 	  "name": "Slides",
	// 	  "kind": "EntitySet",
	// 	  "url": "Slides"
	// 	},
	// 	{
	// 	  "name": "Parables",
	// 	  "kind": "EntitySet",
	// 	  "url": "Parables"
	// 	},
	// 	{
	// 	  "name": "Contemplations",
	// 	  "kind": "EntitySet",
	// 	  "url": "Contemplations"
	// 	},
	// 	{
	// 	  "name": "Anniversaries",
	// 	  "kind": "EntitySet",
	// 	  "url": "Anniversaries"
	// 	},
	// 	{
	// 	  "name": "Clergies",
	// 	  "kind": "EntitySet",
	// 	  "url": "Clergies"
	// 	},
	// 	{
	// 	  "name": "Appointments",
	// 	  "kind": "EntitySet",
	// 	  "url": "Appointments"
	// 	},
	// 	{
	// 	  "name": "Groups",
	// 	  "kind": "EntitySet",
	// 	  "url": "Groups"
	// 	},
	// 	{
	// 	  "name": "Organizations",
	// 	  "kind": "EntitySet",
	// 	  "url": "Organizations"
	// 	},
	// 	{
	// 	  "name": "Positions",
	// 	  "kind": "EntitySet",
	// 	  "url": "Positions"
	// 	},
	// 	{
	// 	  "name": "Saints",
	// 	  "kind": "EntitySet",
	// 	  "url": "Saints"
	// 	},
	// 	{
	// 	  "name": "Users",
	// 	  "kind": "EntitySet",
	// 	  "url": "Users"
	// 	}
	//   ]

}
