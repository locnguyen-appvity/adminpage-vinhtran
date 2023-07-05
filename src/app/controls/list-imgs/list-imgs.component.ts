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
	public title: string = 'Tải lên hình ảnh';
	public dataSources: any[] = [
		{
			name: 'vvvv',
			imageUrl: 'https://kenh14cdn.com/thumb_w/620/203336854389633024/2021/7/8/rosekylucontheground1syho-1625748904950304521404.png'
		},
		{
			name: 'ccccccc',
			imageUrl: 'https://cdn.tgdd.vn/Files/2022/06/07/1437902/cach-tai-hinh-nen-ios-16_1280x720-800-resize.jpg'
		},
		{
			name: 'ffffffffff',
			imageUrl: 'https://teky.edu.vn/blog/wp-content/uploads/2022/03/Hinh-nen-may-tinh-dep-chu-de-phong-canh.jpg'
		},
		{
			name: 'vvvv',
			imageUrl: 'https://kenh14cdn.com/thumb_w/620/203336854389633024/2021/7/8/rosekylucontheground1syho-1625748904950304521404.png'
		},
		{
			name: 'ccccccc',
			imageUrl: 'https://cdn.tgdd.vn/Files/2022/06/07/1437902/cach-tai-hinh-nen-ios-16_1280x720-800-resize.jpg'
		},
		{
			name: 'ffffffffff',
			imageUrl: 'https://teky.edu.vn/blog/wp-content/uploads/2022/03/Hinh-nen-may-tinh-dep-chu-de-phong-canh.jpg'
		},
		{
			name: 'vvvv',
			imageUrl: 'https://kenh14cdn.com/thumb_w/620/203336854389633024/2021/7/8/rosekylucontheground1syho-1625748904950304521404.png'
		},
		{
			name: 'ccccccc',
			imageUrl: 'https://cdn.tgdd.vn/Files/2022/06/07/1437902/cach-tai-hinh-nen-ios-16_1280x720-800-resize.jpg'
		},
		{
			name: 'ffffffffff',
			imageUrl: 'https://teky.edu.vn/blog/wp-content/uploads/2022/03/Hinh-nen-may-tinh-dep-chu-de-phong-canh.jpg'
		},
		{
			name: 'vvvv',
			imageUrl: 'https://kenh14cdn.com/thumb_w/620/203336854389633024/2021/7/8/rosekylucontheground1syho-1625748904950304521404.png'
		},
		{
			name: 'ccccccc',
			imageUrl: 'https://cdn.tgdd.vn/Files/2022/06/07/1437902/cach-tai-hinh-nen-ios-16_1280x720-800-resize.jpg'
		},
		{
			name: 'ffffffffff',
			imageUrl: 'https://teky.edu.vn/blog/wp-content/uploads/2022/03/Hinh-nen-may-tinh-dep-chu-de-phong-canh.jpg'
		},
		{
			name: 'vvvv',
			imageUrl: 'https://kenh14cdn.com/thumb_w/620/203336854389633024/2021/7/8/rosekylucontheground1syho-1625748904950304521404.png'
		},
		{
			name: 'ccccccc',
			imageUrl: 'https://cdn.tgdd.vn/Files/2022/06/07/1437902/cach-tai-hinh-nen-ios-16_1280x720-800-resize.jpg'
		},
		{
			name: 'ffffffffff',
			imageUrl: 'https://teky.edu.vn/blog/wp-content/uploads/2022/03/Hinh-nen-may-tinh-dep-chu-de-phong-canh.jpg'
		}
	];
	public noFilesUploads: boolean = false;

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
				this.dataSources = this.data;
				this.noFilesUploads = false;
			}
		}
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

	onRemoveImage(index: number) {
		this.dataSources.splice(index, 1);
	}
}

