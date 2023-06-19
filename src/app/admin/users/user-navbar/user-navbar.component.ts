import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { IAppState } from 'src/app/shared/redux/state';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent extends SimpleBaseComponent {

	constructor(public override sharedService: SharedPropertyService,
		private store: Store<IAppState>) {
		super(sharedService);
		// this.getValuesFromRedux();
	}

//   getValuesFromRedux() {
// 		this.store
// 			.select<any>((state: any) => state.state)
// 			.pipe(takeUntil(this.unsubscribe))
// 			.subscribe({
// 				next: (completeState: any) => {
// 					this.sharedService.CurrentState = completeState;
// 					this.basePermissions = this.sharedService.CurrentState.userBasePermissions;
// 				}
// 			});
// 	}

}
