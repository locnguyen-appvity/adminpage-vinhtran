import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-search-member',
	templateUrl: './search-member.component.html',
	styleUrls: ['./search-member.component.scss']
})
export class SearchMemberComponent implements OnInit {
	@Input() searchResult: boolean;
	public dataLists: any;

	constructor() {
		this.searchResult = false;
		this.dataLists = [
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
			{
				thumb: '../../assets/images/banner.jpg',
				title: 'Giáo Xứ An Linh',
				address: 'Ấp 9, Xã An Linh, huyện Phú Giáo, Bình Dương',
				email: 'tranducvinh@gmail.com',
				phone: '0274 367 1855',
				population: 9000,
				members: 800,
				saturday: '17g30',
				sunday: '5g30; 17g00',
				days: '5g30'
			},
		]
	}

	ngOnInit(): void {
	}

}
