import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { shareReplay, takeUntil } from 'rxjs';
import { IAppState } from '../shared/redux/state';
import { SharedPropertyService } from '../shared/shared-property.service';
import { SimpleBaseComponent } from '../shared/simple.base.component';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent extends SimpleBaseComponent {

	public title: string = "Cài Đặt Hệ Thống";
	constructor(public override sharedService: SharedPropertyService,
		private store: Store<IAppState>,
		public router: Router) {
		super(sharedService);
		this.router.events.pipe(shareReplay({
			bufferSize: 1,
			refCount: true,
		}), takeUntil(this.unsubscribe)).subscribe((event: any) => {
			this.getTitle();
		});
		// this.getValuesFromRedux();
	}

	getTitle() {
		if (this.router.url.endsWith('user-list')) {
			this.title = "Danh Sách Người Dùng";
		}
	}

	// getValuesFromRedux() {
	// 	this.store
	// 		.select<any>((state: any) => state.state)
	// 		.pipe(takeUntil(this.unsubscribe))
	// 		.subscribe({
	// 			next: (completeState: any) => {
	// 				this.sharedService.CurrentState = completeState;
	// 				this.basePermissions = this.sharedService.CurrentState.userBasePermissions;
	// 				if (this.basePermissions && this.basePermissions.myAppReady && !this.ready) {
	// 					this.ready = true;
	// 					if (!this.basePermissions.settings.view) {
	// 						this.router.navigate(['/my-account/my-account-home']);
	// 					}
	// 				}
	// 				// this.getUserBasePermissions();
	// 			}
	// 		});
	// }
  
  }
  
