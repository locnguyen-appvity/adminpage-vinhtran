import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs';
import { BasePermissions } from '../shared/base.permissions';
import { UPDATE_BASEPERMISSIONS, UPDATE_USER } from '../shared/redux/actions-define';
import { IAppState } from '../shared/redux/state';
import { SharedPropertyService } from '../shared/shared-property.service';
import { SharedService } from '../shared/shared.service';
import { SimpleBaseComponent } from '../shared/simple.base.component';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends SimpleBaseComponent {

	public hide: boolean = true;
	public invalidLogin: boolean = false;
	public formGroup: FormGroup;
	public pictureUrl = './assets/images/logo.png';

	constructor(public override sharedService: SharedPropertyService,
		public router: Router,
		private service: SharedService,
		private store: Store<IAppState>,
		private permission: BasePermissions,
		private fb: FormBuilder) {
		super(sharedService);
		this.formGroup = this.fb.group({
			userName: ["", Validators.required],
			password: ["", Validators.required]
		});
		this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.invalidLogin = false;
		})
		this.getAvatarMyChurch();
	}

	getAvatarMyChurch() {
		this.pictureUrl = './assets/images/logo.png';
		// this.service.getAvatarListForEntityWithValuePublic("-1", 'my-church').pipe(take(1)).subscribe({
		// 	next: (res: any) => {
		// 		if (res && res.value) {
		// 			this.pictureUrl = `data:image/jpeg;base64,${res.value.urlPatch}`;
		// 		}
		// 	}
		// })
	}

	onLogin() {
		let dataJSON = {
			"username": this.formGroup.value.userName,
			"password": this.formGroup.value.password
		}
		// this.service.createToken(dataJSON).pipe(take(1)).subscribe(
		// 	{
		// 		next: (res: any) => {
		// 			if (res && res.data && res.data.accessToken && Object.keys(res.data.accessToken).length > 0) {
		localStorage.setItem('accessToken', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MmQyNDZlNy1lOTZmLTRmYTYtYmYxNS1lMzdmODljNDE5NDIiLCJpYXQiOiI0LzI3LzIwMjMgNjozNzoyNSBBTSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiNDc0NzQyYWItYmY2Yy00N2I3LWIxOWItZTdhOWY3MTU2ODE1IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiMSIsImV4cCI6MTY4MjU3ODA0NSwiaXNzIjoiTGFtIE5ndXllbiIsImF1ZCI6Im5ndXllbnR1bmdsYW12bm1AZ21haWwuY29tIn0.7UjleepWG_0wTNan1OvLTDkUELFktoUrG6AEmvibbJk`);
		// 				// this.service.getVerifyAccessToken(res.data.accessToken).pipe(take(1)).subscribe({
		// 				// 	next: (res: any) => {
		// 						if (res && res.data && res.data.refreshTokenExpiryTime) {
		// 							this.invalidLogin = false;
		// 							// this.store.dispatch({ type: UPDATE_USER, payload: res.data.user });
		// 							// this.sharedService.sharedData({ action: 'update-user-login', data: res.value.user });
		// 							// let basePermissions = this.permission.getBasePermissionForRole(res.value.user.role);
		// 							// this.store.dispatch({ type: UPDATE_BASEPERMISSIONS, payload: basePermissions });
		// 							this.router.navigate(['/web-gppc/episodes-list']);
		// 						}
		// 						else {
		// 							this.invalidLogin = true;
		// 							this.router.navigate(['/login']);
		// 						}

		// 					// }
		// 				// })

		// 			}
		// 			else {
		// 				this.invalidLogin = true;
		// 			}
		// 		},
		// 		error: (error) => {
		// 			this.invalidLogin = true;
		// 			console.error(error);

		// 		}
		// 	}
		// )
		this.service.getAuthors().pipe(take(1)).subscribe({
			next: (res: any) => {
				console.log('getAuthors........',res);
				
			}
		})
	}

}
