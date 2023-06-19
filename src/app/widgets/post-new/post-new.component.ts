import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
	selector: 'se-post-new',
	templateUrl: './post-new.component.html',
	styleUrls: ['./post-new.component.scss']
})
export class PostNewComponent implements OnInit {
	public dataItems: any = [
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Episode 05: Ngày 8/3 trong Vườn Địa Đàng | Phần 01: Hôn Nhân – Gia Đình | Trò chuyên với các bạn trẻ công giáo',
			countView: 12
		},
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Phụng Vụ Chư Thánh | Ngày 02.06 | Thánh Marcellinô Và Phêrô Tử Đạo ( 304)',
			countView: 12
		},
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Phụng Vụ Chư Thánh | Ngày 02.06 | Thánh Đaminh Trần Duy Ninh  - Giáo dân (1841 - 1862)',
			countView: 12
		},
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Mỗi Tuần Một Thành Ngữ | Bài 4: Nằm Gai Nếm Mật',
			countView: 12
		},
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Episode 05: Ngày 8/3 trong Vườn Địa Đàng | Phần 01: Hôn Nhân – Gia Đình | Trò chuyên với các bạn trẻ công giáo',
			countView: 12
		},
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Episode 05: Ngày 8/3 trong Vườn Địa Đàng | Phần 01: Hôn Nhân – Gia Đình | Trò chuyên với các bạn trẻ công giáo',
			countView: 12
		},
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Episode 05: Ngày 8/3 trong Vườn Địa Đàng | Phần 01: Hôn Nhân – Gia Đình | Trò chuyên với các bạn trẻ công giáo',
			countView: 12
		},
		{
			thumb: '../../assets/images/banner.jpg',
			name: 'Episode 05: Ngày 8/3 trong Vườn Địa Đàng | Phần 01: Hôn Nhân – Gia Đình | Trò chuyên với các bạn trẻ công giáo',
			countView: 12
		},
	]
	public limit: number = 10;
	public customOptions: OwlOptions = {
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: true,
		navSpeed: 700,
		navText: ['', ''],
		responsive: {
			0: {
				items: 1
			},
			400: {
				items: 2
			},
			740: {
				items: 3
			},
			940: {
				items: 6
			}
		},
		nav: false
	}

	constructor() { }

	ngOnInit(): void {
	}

}
