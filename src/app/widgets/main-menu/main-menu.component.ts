import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
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
	public customOptions: OwlOptions = {
		margin: 12,
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: false,
		autoplay: true,
		autoplaySpeed: 500,
		navSpeed: 700,
		navText: ['', ''],
		responsive: {
			0: {
				items: 2
			},
			400: {
				items: 2
			},
			740: {
				items: 2
			},
			940: {
				items: 2
			}
		},
		nav: false
	}
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
			],
			dataPosts: [
				{
					id: 1,
					title: 'Hội dòng mến thánh giá thủ thiêm trong ngày gặp mặt với lương dân, chủ đề “có chúa trong đời”',
					discription: 'Hôm nay lúc 7g15 ngày 03/5/2023, tại Trung tâm Mục vụ giáo phận Phú Cường, có cuộc gặp gỡ giữa những người chưa nhận biết Chúa, những người vì lý do riêng đã xa Chúa được đến đây trong niềm vui, trong tình thương để nhận ra “có Chúa trong đời”. Đó cũng là mục đích, lý tưởng sống trong vườn ươm ơn gọi thiêng liêng của Hội dòng Mến Thánh Giá Thủ Thiêm có nhiều cộng đoàn đang hoạt động nơi giáo phận Phú Cường',
					pictureUrl: 'https://giaophanphucuong.org//Image/_thumbs/Picture/Images/cao-pho-bo-cha-dom.png',
				},
				{
					id: 2,
					title: 'Sứ điệp của ĐTC cho ngày Thế giới Người Di dân và Người Tị nạn lần thứ 109 (2023)”',
					discription: 'Trong Sứ điệp cho ngày Thế giới Người Di dân và Người Tị nạn năm 2023, có tựa đề “Tự do chọn di cư hay ở lại”, được công bố vào thứ Năm 11/5/2023, Đức Thánh Cha tái khẳng định quyền không di cư, nghĩa là quyền được sống trong hòa bình và xứng nhân phẩm tại quê hương đất nước của mình',
					pictureUrl: 'https://giaophanphucuong.org/Image/_thumbs/Picture/Images/Hinh-Suy-Niem/02-Nam-A/03%20Mua%20Phuc%20Sinh/Chua%20Nhat%20VII%20Mua%20Phuc%20Sinh/Chu%CC%81a%20Nha%CC%A3%CC%82t%20Chu%CC%81a%20Tha%CC%86ng%20Thie%CC%82n%20A%20-%205.jpg',
				},
				{
					id: 3,
					title: 'Hội dòng mến thánh giá thủ thiêm trong ngày gặp mặt với lương dân, chủ đề “có chúa trong đời”',
					discription: 'Hôm nay lúc 7g15 ngày 03/5/2023, tại Trung tâm Mục vụ giáo phận Phú Cường, có cuộc gặp gỡ giữa những người chưa nhận biết Chúa, những người vì lý do riêng đã xa Chúa được đến đây trong niềm vui, trong tình thương để nhận ra “có Chúa trong đời”. Đó cũng là mục đích, lý tưởng sống trong vườn ươm ơn gọi thiêng liêng của Hội dòng Mến Thánh Giá Thủ Thiêm có nhiều cộng đoàn đang hoạt động nơi giáo phận Phú Cường',
					pictureUrl: 'https://giaophanphucuong.org//Image/_thumbs/Picture/Images/cao-pho-bo-cha-dom.png',
				},
				{
					id: 4,
					title: 'Sứ điệp của ĐTC cho ngày Thế giới Người Di dân và Người Tị nạn lần thứ 109 (2023)”',
					discription: 'Trong Sứ điệp cho ngày Thế giới Người Di dân và Người Tị nạn năm 2023, có tựa đề “Tự do chọn di cư hay ở lại”, được công bố vào thứ Năm 11/5/2023, Đức Thánh Cha tái khẳng định quyền không di cư, nghĩa là quyền được sống trong hòa bình và xứng nhân phẩm tại quê hương đất nước của mình',
					pictureUrl: 'https://giaophanphucuong.org/Image/_thumbs/Picture/Images/Hinh-Suy-Niem/02-Nam-A/03%20Mua%20Phuc%20Sinh/Chua%20Nhat%20VII%20Mua%20Phuc%20Sinh/Chu%CC%81a%20Nha%CC%A3%CC%82t%20Chu%CC%81a%20Tha%CC%86ng%20Thie%CC%82n%20A%20-%205.jpg',
				},
				{
					id: 5,
					title: 'Hội dòng mến thánh giá thủ thiêm trong ngày gặp mặt với lương dân, chủ đề “có chúa trong đời”',
					discription: 'Hôm nay lúc 7g15 ngày 03/5/2023, tại Trung tâm Mục vụ giáo phận Phú Cường, có cuộc gặp gỡ giữa những người chưa nhận biết Chúa, những người vì lý do riêng đã xa Chúa được đến đây trong niềm vui, trong tình thương để nhận ra “có Chúa trong đời”. Đó cũng là mục đích, lý tưởng sống trong vườn ươm ơn gọi thiêng liêng của Hội dòng Mến Thánh Giá Thủ Thiêm có nhiều cộng đoàn đang hoạt động nơi giáo phận Phú Cường',
					pictureUrl: 'https://giaophanphucuong.org//Image/_thumbs/Picture/Images/cao-pho-bo-cha-dom.png',
				},
				{
					id: 6,
					title: 'Sứ điệp của ĐTC cho ngày Thế giới Người Di dân và Người Tị nạn lần thứ 109 (2023)”',
					discription: 'Trong Sứ điệp cho ngày Thế giới Người Di dân và Người Tị nạn năm 2023, có tựa đề “Tự do chọn di cư hay ở lại”, được công bố vào thứ Năm 11/5/2023, Đức Thánh Cha tái khẳng định quyền không di cư, nghĩa là quyền được sống trong hòa bình và xứng nhân phẩm tại quê hương đất nước của mình',
					pictureUrl: 'https://giaophanphucuong.org/Image/_thumbs/Picture/Images/Hinh-Suy-Niem/02-Nam-A/03%20Mua%20Phuc%20Sinh/Chua%20Nhat%20VII%20Mua%20Phuc%20Sinh/Chu%CC%81a%20Nha%CC%A3%CC%82t%20Chu%CC%81a%20Tha%CC%86ng%20Thie%CC%82n%20A%20-%205.jpg',
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
				},
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
				},
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
