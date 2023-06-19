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
				thumb: '../../assets/images/banner.jpg',
				name: 'HẠNH CÁC THÁNH',
			},
			{
				thumb: '../../assets/images/banner.jpg',
				name: 'ƠN GỌI',
			},
			{
				thumb: '../../assets/images/banner.jpg',
				name: 'PHỤNG VỤ',
			},
			{
				thumb: '../../assets/images/banner.jpg',
				name: 'TÀI LIỆU',
			},
			{
				thumb: '../../assets/images/banner.jpg',
				name: 'HẠNH CÁC THÁNH',
			},
			{
				thumb: '../../assets/images/banner.jpg',
				name: 'ƠN GỌI',
			},
			{
				thumb: '../../assets/images/banner.jpg',
				name: 'PHỤNG VỤ',
			},
			{
				thumb: '../../assets/images/banner.jpg',
				name: 'TÀI LIỆU',
			},
		]
	}

	ngOnInit(): void {
	}

}
