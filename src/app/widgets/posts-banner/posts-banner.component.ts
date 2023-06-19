import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-posts-banner',
	templateUrl: './posts-banner.component.html',
	styleUrls: ['./posts-banner.component.scss']
})
export class PostsBannerComponent implements OnInit {
	public logoRightUrl = './assets/images/logo-right.png';
	public dataItems: any = [
		{
			thumb: './assets/images/banner.jpg',
			title: 'Education',
			content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, nostrum?',
		},
		{
			thumb: './assets/images/banner.jpg',
			title: 'Education',
			content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, nostrum?',
		},
		{
			thumb: './assets/images/banner.jpg',
			title: 'Education',
			content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, nostrum?',
		},
		{
			thumb: './assets/images/banner.jpg',
			title: 'Education',
			content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, nostrum?',
		}
	]
	public bgImage = './assets/images/banner.jpg';
	constructor() { }

	ngOnInit(): void {
	}

}
