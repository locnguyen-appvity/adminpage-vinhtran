import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { take } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { GlobalSettings } from 'src/app/shared/global.settings';

@Component({
	selector: 'se-slide-list-imgs',
	styleUrls: ['./slide-list-imgs.component.scss'],
	templateUrl: './slide-list-imgs.component.html'
})
export class SideListIMGsComponent extends SimpleBaseComponent implements OnChanges {
	@Output() valueChanges: any = new EventEmitter();
	@Input() slideId: string;
	@Input() entityID: string;
	@Input() entityName: string;
	public dataSources: any[] = [];
	public loadingIMGs: boolean = false;

	constructor(public sharedService: SharedPropertyService,
		private service: SharedService) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['slideId']) {
			this.getSlide(this.slideId);
		}
	}

	valueChangesFile(event: any) {
		if (event) {
			if (event.action == "save-data") {
				let dataJSON = {
					"photos": event.data ? event.data.map(it => it.filePath) : [],
					"texts": event.data ? event.data.map(it => it.name) : [],
					"avatar": (event.data && event.data[0]) ? event.data[0].filePath : "",
				}
				this.dataProcessing = true;
				this.loadingIMGs = true;
				this.service.updateSlide(this.slideId, dataJSON).pipe(take(1)).subscribe({
					next: (res: any) => {
						this.dataProcessing = false;
						this.loadingIMGs = false;
						this.getSlide(this.slideId);
					}
				})
			}
			else if (event.action == "delete") {
				this.loadingIMGs = true;
				this.service.deleteSlide(this.slideId).pipe(take(1)).subscribe({
					next: () => {
						this.loadingIMGs = false;
						this.valueChanges.emit({ action: "delete" });
						// this.getSlide(this.slideId);
					}
				})
			}
		}
	}

	createItem() {
		let dataJSON = {
			"name": this.entityName,
			"photos": [],
			"texts": [],
			"context": "",
			"avatar": "",
			"status": ""
		}
		this.loadingIMGs = true;
		this.service.createSlide(dataJSON).pipe(take(1)).subscribe({
			next: (res: any) => {
				this.loadingIMGs = false;
				this.valueChanges.emit({ action: "add-slide", data: res.data });
				// this.getSlide(this.slideId);
			}
		})
	}

	getSlide(slideID: string) {
		this.loadingIMGs = true;
		this.service.getSlide(slideID).pipe(take(1)).subscribe({
			next: (res: any) => {
				this.loadingIMGs = false;
				if (res) {
					let fileSelected = [];
					if (res.photos && res.photos.length > 0) {
						let index = 0;
						for (let filePath of res.photos) {
							fileSelected.push({
								name: (res.texts && res.texts[index]) ? res.texts[index] : "",
								filePath: filePath,
								imageUrl: `${GlobalSettings.Settings.Server}/${filePath}`
							});
							index++;
						}
					}
					this.dataSources = fileSelected;
				}
			}
		})
	}

}

