import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent extends SimpleBaseComponent {
	public pictureUrl = './assets/images/logo-for-web.png';
	public logoRightUrl = './assets/images/logo-right.png';
	public categories: any[] = [
		{
			name: 'Giáo Phận',
			code: 'giao-phan',
			data: [
				{
					name: 'Giới Thiệu',
					code: 'giao-phan',
					order: 1
				},
				{
					name: 'Giáo Hạt - Giáo Xứ',
					code: 'giao-hat-giao-xu',
					order: 1
				},
				{
					name: 'Nhà Thờ Chánh Tòa',
					code: 'nha-tho-chanh-toa',
					order: 1
				},
				{
					name: 'Năm Thánh',
					code: 'nam-thanh',
					order: 1
				},
				{
					name: 'Giám Mục',
					code: 'giam-muc',
					order: 1
				},
				{
					name: 'Linh Mục Đoàn',
					code: 'linh-muc-doan',
					order: 1
				}
			]
		},
		{
			name: 'Tin Giáo Hội',
			code: 'tin-giao-hoi',
			data: [
				{
					name: 'Tin Giáo Phận',
					code: 'tin-giao-phan',
					order: 1
				},
				{
					name: 'Tin Giáo Hội Việt Nam',
					code: 'tin-giao-hoi-viet-nam',
					order: 2
				},
				{
					name: 'Tin Giáo Hội Hoàn Vũ',
					code: 'tin-giao-hoi-hoan-vu',
					order: 3
				},
				{
					name: 'Đức Giáo Hoàng',
					code: 'duc-giao-hoang',
					order: 4
				}
			]
		},
		{
			name: 'Lời Chúa',
			code: 'loi-chua'
		},
		{
			name: 'Muối Men Cho Đời',
			code: 'muoi-men-cho-doi'
		},
		{
			name: 'Phụng Vụ',
			code: 'phung-vu'
		},
		{
			name: 'Ơn Gọi Linh Mục',
			code: 'on-goi-linh-muc'
		},
		{
			name: 'Dòng Tu',
			code: 'dong-tu'
		},
		{
			name: 'Mục Vụ',
			code: 'muc-vu'
		},
		{
			name: 'Tài Liệu',
			code: 'tai-lieu'
		},
		{
			name: 'Văn Kiện',
			code: 'van-kien'
		},
		{
			name: 'Văn Hóa',
			code: 'van-hoa'
		},
		{
			name: 'Thông Báo',
			code: 'thong-tin'
		},
		{
			name: 'Media',
			code: 'media'
		}
	];
	public currentItem: any;
	public currentItemCode: string = "";
	public isShowPopup: boolean = false;

	constructor(
		public sharedService: SharedPropertyService
	) {
		super(sharedService);
	}

	getCurrentItem(item: any) {
		if (item) {
			this.currentItem = item;
		}
	}

	selectedItem(item: any) {

	}

	closedPopover() {
		this.currentItemCode = "";
	}

	openedPopover(item: any) {
		this.currentItemCode = item.code;
	}
}
