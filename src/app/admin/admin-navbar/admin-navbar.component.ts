import { Component, Input } from '@angular/core';
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

	constructor(public override sharedService: SharedPropertyService,
		private store: Store<IAppState>) {
		super(sharedService);
		this.getValuesFromRedux();
	}

	onColseMainMenu() {
		this.sharedService.sharedData({action:'side-nav-close'});
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
