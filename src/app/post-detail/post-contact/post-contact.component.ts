import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-post-contact',
  templateUrl: './post-contact.component.html',
  styleUrls: ['./post-contact.component.scss']
})
export class PostContactComponent implements OnInit {

  public contact: any = {
    name: "Admin",
		pictureUrl: './assets/icons/ic_person_48dp.svg',
    time: '17/05/2023'
  }
  constructor() { }

  ngOnInit(): void {
  }

}
