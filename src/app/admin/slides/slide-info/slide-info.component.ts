import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-slide-info',
	templateUrl: './slide-info.component.html',
	styleUrls: ['./slide-info.component.scss']
})
export class SlideInfoComponent extends SimpleBaseComponent implements OnInit {


	public postFormGroup: FormGroup;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách Albums";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public fileSelected: any[] = [];
	public avatarSelected: any;

	constructor(
		private service: SharedService,
		public sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public router: Router,
		public snackbar: MatSnackBar,
		public activeRoute: ActivatedRoute,
		public dialog: MatDialog
	) {
		super(sharedService);
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (!this.isNullOrEmpty(this.ID)) {
			this.getSlide();
		}

	}

	ngOnInit(): void {
		this.postFormGroup = this.fb.group({
			name: "",
			context: ""
		});
	}

	valueChangesFile(event: any) {
		if (event && event.action == 'value-change') {
			this.fileSelected = event.data ? event.data : "";
		}
	}

	valueChangesAvatar(event: any) {
		if (event && event.action == 'value-change') {
			this.avatarSelected = event.data ? event.data : "";
		}
	}


	updateLabelTitle(status: string) {
		let statusLabel = {
			title: "Tạo Mới",
			class: 'draft-label'
		}
		switch (status) {
			case 'draft':
				statusLabel.title = "Lưu Nháp";
				statusLabel.class = "pending-label";
				break;
			case 'publish':
				statusLabel.title = "Đã Xuất Bản";
				statusLabel.class = "approved-label";
				break;
			case 'inactive':
				statusLabel.title = "Tạm Ẩn";
				statusLabel.class = "rejected-label";
				break;
		}
		return statusLabel;
	}

	routeToBack() {
		this.router.navigate(['/admin/slides/slides-list']);
	}

	getSlide() {
		this.service.getSlide(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.fileSelected = [];
					this.localItem = res;
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					if (this.localItem.photos && this.localItem.photos.length > 0) {
						let index = 0;
						for (let filePath of this.localItem.photos) {
							this.fileSelected.push({
								name: (this.localItem.texts && this.localItem.texts[index]) ? this.localItem.texts[index] : "",
								filePath: filePath,
								imageUrl: `${GlobalSettings.Settings.Server}/${filePath}`
							});
							index++;
						}
					}
					this.localItem._photos = this.fileSelected;
					this.postFormGroup.patchValue({
						name: this.localItem.name,
						context: this.localItem.context,
						avatar: this.localItem.avatar,
					});
				}
			}
		})
	}

	onCancel() {
		this.router.navigate(['/admin/slides/slides-list']);
	}

	onSave(status: string) {
		let valueForm = this.postFormGroup.value;
		let dataJSON = {
			"name": valueForm.name,
			"photos": this.fileSelected ? this.fileSelected.map(it => it.filePath) : [],
			"texts": this.fileSelected ? this.fileSelected.map(it => it.name) : [],
			"context": valueForm.context,
			"avatar": this.avatarSelected ? this.avatarSelected.filePath : valueForm.photo,
			"status": status
		}
		let request: any;
		if (!this.isNullOrEmpty(this.ID)) {
			request = this.service.updateSlide(this.ID, dataJSON);
		}
		else {
			request = this.service.createSlide(dataJSON)
		}
		request.pipe(take(1)).subscribe({
			next: () => {
				let snackbarData: any = {
					key: 'saved-item',
					message: 'Lưu Thành Công'
				};
				this.showInfoSnackbar(snackbarData);
				this.router.navigate(['/admin/slides/slides-list']);
			}
		})
	}

	showInfoSnackbar(dataInfo: any) {
		this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
			duration: 5000,
			data: dataInfo,
			horizontalPosition: 'start'
		});
	}

}
