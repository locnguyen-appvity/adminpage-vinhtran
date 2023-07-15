import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-post-author',
	templateUrl: './post-author.component.html',
	styleUrls: ['./post-author.component.scss']
})
export class PostAuthorComponent extends SimpleBaseComponent implements OnChanges {

	@Input() authorID: string;
	public author: any;
	constructor(
		public sharedService: SharedPropertyService,
		private service: SharedService,
	) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['authorID']) {
			if (!this.isNullOrEmpty(this.authorID)) {
				this.getPost();
			}

		}
	}

	getPost() {
		this.service.getAuthor(this.authorID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.author = res;
					this.author.pictureUrl = './assets/icons/ic_person_48dp.svg';
					if (this.author.photo) {
						this.author.pictureUrl = `${GlobalSettings.Settings.Server}/${this.author.photo}`;
					}
				}
			}
		})
	}

}
