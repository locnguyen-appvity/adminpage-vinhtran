import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs';
import { BasePermissions } from '../shared/base.permissions';
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
			username: ["", Validators.required],
			password: ["", Validators.required]
		});
		this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.invalidLogin = false;
		})
		this.getAvatarMyChurch();
		let accessToken = localStorage.getItem('accessToken');
		if (!this.isNullOrEmpty(accessToken)) {
			this.router.navigate(['/admin']);
		}
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
			"username": this.formGroup.value.username,
			"password": this.formGroup.value.password
		}
		this.service.createToken(dataJSON).pipe(takeUntil(this.unsubscribe)).subscribe(
			{
				next: (res: any) => {
					if (res && res.status && res.data && res.data.accessToken) {
						localStorage.setItem('accessToken', res.data.accessToken);
						localStorage.setItem('refreshToken', res.data.refreshToken);
						localStorage.setItem('refreshTokenExpiryTime', res.data.refreshTokenExpiryTime);
						// this.service.getVerifyAccessToken(res.data.accessToken).pipe(take(1)).subscribe({
						// 	next: (res: any) => {
								// if (res && res.data && res.data.refreshTokenExpiryTime) {
									this.invalidLogin = false;
								// 	// this.store.dispatch({ type: UPDATE_USER, payload: res.data.user });
								// 	// this.sharedService.sharedData({ action: 'update-user-login', data: res.value.user });
								// 	// let basePermissions = this.permission.getBasePermissionForRole(res.value.user.role);
								// 	// this.store.dispatch({ type: UPDATE_BASEPERMISSIONS, payload: basePermissions });
									this.router.navigate(['/admin']);
								// }
								// else {
								// 	this.invalidLogin = true;
								// 	this.router.navigate(['/login']);
								// }

						// 	}
						// })

					}
					else {
						this.invalidLogin = true;
					}
				},
				error: (error) => {
					this.invalidLogin = true;
					console.error(error);

				}
			}
		)
	}

}
