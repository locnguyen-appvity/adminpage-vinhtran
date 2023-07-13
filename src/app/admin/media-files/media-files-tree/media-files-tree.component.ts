import { Component} from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-media-files-tree',
	templateUrl: './media-files-tree.component.html',
	styleUrls: ['./media-files-tree.component.scss'],
	// providers: [FileDatabase]
})
export class MediaFilesTreeComponent extends SimpleBaseComponent {
	public canEdit: boolean = true;

	constructor(public override sharedService: SharedPropertyService) {
		super(sharedService);
	}

}

