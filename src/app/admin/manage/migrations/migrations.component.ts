import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-migrations',
	templateUrl: './migrations.component.html',
	styleUrls: ['./migrations.component.scss']
})
export class MigrationsComponent extends SimpleBaseComponent {

	constructor(public override sharedService: SharedPropertyService) {
		super(sharedService);
	}

}
