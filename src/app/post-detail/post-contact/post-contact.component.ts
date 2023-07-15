import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'se-post-contact',
  templateUrl: './post-contact.component.html',
  styleUrls: ['./post-contact.component.scss']
})
export class PostContactComponent implements OnInit {

  @Input() contact: any;
  //  = {
  //   name: "Admin",
	// 	pictureUrl: './assets/icons/ic_person_48dp.svg',
  //   time: '17/05/2023'
  // }
  public pictureUrl: string = "./assets/icons/ic_person_48dp.svg"
  constructor() { }

  ngOnInit(): void {
  }

}
