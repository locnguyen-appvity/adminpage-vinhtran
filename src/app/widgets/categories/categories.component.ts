import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
	public dataItems: any;

	constructor() {
		this.dataItems = [
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'HẠNH CÁC THÁNH',
			},
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'ƠN GỌI',
			},
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'PHỤNG VỤ',
			},
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'TÀI LIỆU',
			},
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'HẠNH CÁC THÁNH',
			},
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'ƠN GỌI',
			},
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'PHỤNG VỤ',
			},
			{
				thumb: 'http://admin.dev.giaophanphucuong.com/public/storage/images/71a7fb23-4d52-463d-be42-d8f2c44e077c.jpeg',
				name: 'TÀI LIỆU',
			},
		]
	}

	ngOnInit(): void {
	}

}
