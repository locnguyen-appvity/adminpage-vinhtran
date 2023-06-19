import { Component, Optional, Inject, OnDestroy } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'kmi-toast-snackbar',
	templateUrl: './toast-snackbar.component.html',
	styleUrls: ['./toast-snackbar.component.scss']
})
export class ToastSnackbarAppComponent implements OnDestroy {
	public data: any;

	constructor(private snackbar: MatSnackBar,
		@Optional() @Inject(MAT_SNACK_BAR_DATA) private snackbarData: any) {
		this.updateDataInfo(this.snackbarData);
	}

	updateDataInfo(snackbarData: any) {
		let data: any = {
			icon: '',
			class: '',
			message: '',
			link: '',
			action: ''
		};
		switch (snackbarData.key) {
			case 'new-item':
				data = {
					icon: 'ic_check_circle_48px',
					class: 'success-snackbar',
					message: snackbarData?.message
				};
				break;
			case 'saved-item':
				data = {
					icon: 'ic_check_circle_48px',
					class: 'success-snackbar',
					message: snackbarData?.message
				};
				break;
			case 'save-draf-item':
				data = {
					icon: 'ic_post_add',
					class: 'info-snackbar',
					message: snackbarData?.message
				};
				break;
			case 'delete-item':
				data = {
					icon: 'ic_check_circle_48px',
					class: 'success-snackbar',
					message: snackbarData?.message
				};
				break;
			case 'inactivate-item':
				data = {
					icon: 'ic_check_circle_48px',
					class: 'success-snackbar',
					message: snackbarData?.message
				}
				break;
			case 'activated-item':
				data = {
					icon: 'ic_check_circle_48px',
					class: 'success-snackbar',
					message: snackbarData?.message
				}
				break;
		}
		this.data = data;
	}

	hiddenSnackbar() {
		this.snackbar.dismiss();
	}

	private _releaseComponentProperties(): void {
		this.data = null;
	}

	public ngOnDestroy(): void {
		this._releaseComponentProperties();
	}
}
