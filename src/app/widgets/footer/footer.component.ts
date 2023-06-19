import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public pictureUrl = './assets/images/logo-for-web.png';
  public itemApp = './assets/images/itemApp.jpg';

  constructor() { }

  ngOnInit(): void {
  }

}
