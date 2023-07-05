import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { DialogSelectedImgsComponent } from '../dialog-selected-imgs/dialog-selected-imgs.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'se-upload-avatar',
	templateUrl: './upload-avatar.component.html',
	styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent extends SimpleBaseComponent implements OnChanges {

	@ViewChild("fileInput", { static: false }) fileInput: any;
	public disabledRemoveBtn: boolean = true;
	@Input() entityID: string = '';
	@Input() filePath: string = '';
	@Input() type: string = 'member';
	@Output() uploadFile: any = new EventEmitter();
	@Output() valueChanges: any = new EventEmitter();

	public imageUrl: any = "./assets/icons/ic_image_48dp.svg";
	// private file: File;
	public hasBeenAvatar: boolean = false;
	public msgError: string = '';
	public setWidthImg: number;
	public setHeightImg: number;

	// private cacheFile: any = null;

	constructor(public sharedService: SharedPropertyService,
		public dialog: MatDialog,
		private sanitizer: DomSanitizer,
		private service: SharedService) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityID']) {
			// this.cacheFile = null;
			if (!this.isNullOrEmpty(this.entityID)) {
				this.getFile();
			}
		}
		if (changes['filePath']) {
			if (!this.isNullOrEmpty(this.filePath)) {
				this.imageUrl = `${GlobalSettings.Settings.Server}/${this.filePath}`;
			}
			else {
				this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_image_48dp.svg');
			}
		}
	}

	getFile() {
		this.service.getFile(this.entityID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					// this.cacheFile = res.value;
					this.disabledRemoveBtn = false;
					this.imageUrl = res.fileUrl;
				}
			}
		})
	}

	chooseImage() {
		let config: any = {
			data: { target: 'single' }
		};
		config.disableClose = false;
		config.panelClass = 'dialog-form-xxl';
		config.maxWidth = '90vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(DialogSelectedImgsComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res && res.action == 'save') {
					let file;
					if (res.data && res.data[0]) {
						file = res.data[0];
						this.imageUrl = res.data[0].fileUrl;
					}
					this.valueChanges.emit({ action: 'value-change', data: file });
				}
			}
		})
	}

	clearAvatar() {
		// this.file = null;
		this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_image_48dp.svg');
		this.fileInput.nativeElement.value = '';
		this.hasBeenAvatar = false;
		this.disabledRemoveBtn = true;
		this.valueChanges.emit({ action: 'value-change', data: '' });
	}

}
