import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListItemBaseComponent } from 'src/app/controls/list-item-base/list-item.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	selector: 'app-slides-list',
	templateUrl: './slides-list.component.html',
	styleUrls: ['./slides-list.component.scss'],
	// providers: [FileDatabase]
})
export class SlidesListComponent extends ListItemBaseComponent {
	@Input() canEdit: boolean = false;

	constructor(public override sharedService: SharedPropertyService,
		private service: SharedService,
		public snackbar: MatSnackBar,
		private sanitizer: DomSanitizer,
		public router: Router,
		public dialog: MatDialog) {
		super(sharedService, snackbar);
		this.getDataItems();
	}

	onAddItem() {
		this.router.navigate([`/admin/slides/slide-info`]);
	}

	onUpdateStatus(item: any, status: string) {
		let dataJSON = {
			status: status
		}
		this.dataProcessing = true;
		this.service.updateSlide(item.id, dataJSON).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			this.getDataItems();
		})
	}

	onChangeData(item: any) {
		this.router.navigate([`/admin/slides/slide-info/${item.id}`]);
	}

	getDataItems() {
		this.dataProcessing = true;
		this.service.getSlides().pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res && res.value) {
					this.noData = false;
					this.arrData = res.value;
					for (let item of this.arrData) {
						item.pictureUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_image_48dp.svg');
						if (item.avatar) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.avatar}`;
						}
						item.countPhoto = 0;
						if (item.photos && item.photos.length > 0) {
							item.countPhoto = item.photos.length;
						}

					}
				}
				else {
					this.noData = true;
				}
				this.dataProcessing = false;
			}
		})
	}



	deleteItem(item: any) {
		if (item && item.children && item.children.length > 0) {
			return;
		}
		this.dataProcessing = true;
		this.service.deleteSlide(item.id).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			this.getDataItems();
		})
	}

}

