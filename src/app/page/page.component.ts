import { Component, OnInit } from '@angular/core';
import { SimpleBaseComponent } from '../shared/simple.base.component';
import { SharedPropertyService } from '../shared/shared-property.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent extends SimpleBaseComponent {


  constructor(
		public override sharedService: SharedPropertyService
	) {
		super(sharedService);

  }
}
