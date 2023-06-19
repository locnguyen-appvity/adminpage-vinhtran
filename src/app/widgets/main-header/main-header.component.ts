import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent extends SimpleBaseComponent {

	public pictureUrl = './assets/images/logo-for-web.png';
	public logoRightUrl = './assets/images/logo-right.png';

	constructor(public sharedService: SharedPropertyService) {
		super(sharedService);
	}

	ngOnInit(): void {
	}

}
