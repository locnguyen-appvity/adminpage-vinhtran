import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-clergys',
	templateUrl: './clergys.component.html',
	styleUrls: ['./clergys.component.scss']
})
export class ClergysComponent extends SimpleBaseComponent {

	public positionList: any[] = [];
	public typeList: any[] = [];

	constructor(public override sharedService: SharedPropertyService) {
		super(sharedService);
	}

}
