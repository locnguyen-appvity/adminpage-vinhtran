import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-organizations',
	templateUrl: './organizations.component.html',
	styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent extends SimpleBaseComponent {

	constructor(public override sharedService: SharedPropertyService) {
		super(sharedService);
	}

}
