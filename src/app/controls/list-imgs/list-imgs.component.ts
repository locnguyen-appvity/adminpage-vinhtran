import { Component, Input, Output, EventEmitter, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { LinqService } from 'src/app/shared/linq.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, } from 'rxjs';
import { DialogSelectedImgsComponent } from '../dialog-selected-imgs/dialog-selected-imgs.component';
import { GlobalSettings } from 'src/app/shared/global.settings';

@Component({
	selector: 'se-list-imgs',
	styleUrls: ['./list-imgs.component.scss'],
	templateUrl: './list-imgs.component.html'
})
export class ListIMGsComponent extends SimpleBaseComponent implements OnChanges {
	@Output() valueChanges: any = new EventEmitter();
	@Input() data: any[] = [];
	@Input() mode: string = "";
	public title: string = 'Tải lên hình ảnh';
	public dataSources: any[] = [];
	public noFilesUploads: boolean = false;
	public hasChange: boolean = false;

	constructor(public sharedService: SharedPropertyService,
		public renderer: Renderer2,
		public linq: LinqService,
		public dialog: MatDialog,
		public router: Router) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['data']) {
			this.noFilesUploads = true;
			this.dataSources = [];
			if (this.data && this.data.length > 0) {
				this.dataSources = this.data.concat([]);
				this.noFilesUploads = false;
			}
		}
	}

	onChangeText(){
		this.hasChange = true;
	}

	chooseImage() {
		let config: any = {
			data: { target: 'multi' }
		};
		config.disableClose = false;
		config.panelClass = 'dialog-form-xxl';
		config.maxWidth = '90vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(DialogSelectedImgsComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				if (res && res.action == 'save' && res.data.length > 0) {
					this.noFilesUploads = false;
					for (let item of res.data) {
						this.dataSources.push({
							name: "",
							filePath: item.filePath,
							imageUrl: `${GlobalSettings.Settings.Server}/${item.filePath}`
						})
					}
					this.valueChanges.emit({ action: 'value-change', data: this.dataSources });
				}
			}
		})
	}

	onDelete(){
		this.valueChanges.emit({ action: 'delete' });
	}

	onSave(){
		this.valueChanges.emit({ action: 'save-data', data: this.dataSources });
	}

	onCancel(){
		this.dataSources = this.data;
		this.valueChanges.emit({ action: 'cancel' });
	}

	onRemoveImage(index: number) {
		this.dataSources.splice(index, 1);
	}
}

