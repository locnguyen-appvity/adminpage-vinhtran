import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-admin-navbar',
	templateUrl: './admin-navbar.component.html',
	styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent extends SimpleBaseComponent {

	public iNotificationMyAccount: number = 10;
	public currentUser: any = {
		id: "",
		name: "Admin",
		pictureUrl: './assets/images/logo-for-web.png' //'./assets/icons/ic_person_48dp.svg'
	};
	@Input() opened: boolean = true;
	public openedPanel: string = 'post';

	constructor(public override sharedService: SharedPropertyService,
		public router: Router,
		private store: Store<IAppState>) {
		super(sharedService);
		this.getValuesFromRedux();
		this.updateExpand();
	}

	updateExpand() {
		if (
			this.router.url.startsWith('/admin/posts') ||
			this.router.url.startsWith('/admin/parables') ||
			this.router.url.startsWith('/admin/contemplations') ||
			this.router.url.startsWith('/admin/slides') ||
			this.router.url.startsWith('/admin/folders')
		) {
			this.openedPanel = "post";
		}
		if (
			this.router.url.startsWith('/admin/episodes') ||
			this.router.url.startsWith('/admin/chapters') ||
			this.router.url.startsWith('/admin/books') ||
			this.router.url.startsWith('/admin/media-files')
		) {
			this.openedPanel = "media";
		}
		if (
			this.router.url.startsWith('/admin/categories-list') ||
			this.router.url.startsWith('/admin/tags') ||
			this.router.url.startsWith('/admin/thanh') ||
			this.router.url.startsWith('/admin/le') ||
			this.router.url.startsWith('/admin/catalogues-list') ||
			this.router.url.startsWith('/admin/authors') 
		) {
			this.openedPanel = "data";
		}
		if (
			this.router.url.startsWith('/admin/websites')
		) {
			this.openedPanel = "websites";
		}
		if (this.router.url.startsWith('/admin/manage')) {
			this.openedPanel = "manage";
		}
		if (this.router.url.startsWith('/admin/users-list')) {
			this.openedPanel = "system";
		}
	}

	onColseMainMenu() {
		this.sharedService.sharedData({ action: 'side-nav-close' });
		this.opened = false;
	}

	getValuesFromRedux() {
		this.store
			.select<any>((state: any) => state.state)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe({
				next: (completeState: any) => {
					this.sharedService.CurrentState = completeState;
					this.basePermissions = this.sharedService.CurrentState.userBasePermissions;
				}
			});
	}

}
