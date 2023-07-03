import { AfterViewInit, Component, EventEmitter, Input,OnChanges,Output, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-search-organizations',
	templateUrl: './search-organizations.component.html',
	styleUrls: ['./search-organizations.component.scss']
})
export class SearchOrganizationsComponent extends SimpleBaseComponent implements OnChanges, AfterViewInit {

	@Output() valueChange: EventEmitter<any> = new EventEmitter();

	@Input() data: any;
	@Input() title: string = '';
	@Input() loadDefeault: boolean = false;
	public dataLists: any = [];
	public arrGroups: any[] = [];
	public loading: boolean = false;

	constructor(public sharedService: SharedPropertyService,
		public dialog: MatDialog,
		public service: SharedService) {
		super(sharedService);
		this.getGroups();
	}

	ngAfterViewInit(): void {
		if(this.loadDefeault){
			this.getOrganizations();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['data']){
			this.getOrganizations();
		}
	}

	getGroups() {
		this.dataLists = [];
		this.service.getGroups().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.arrGroups = items;
			}
		})
	}

	getFilter(){
		let filter = "type eq 'giao_xu' and status eq 'publish'";
		if(this.data){
			if(this.data.groupID && this.data.groupID != 'all'){
				if(!this.isNullOrEmpty(filter)){
					filter = `${filter} and groupID eq ${this.data.groupID}`
				}
				else {
					filter = `groupID eq ${this.data.groupID}`
				}
			}
			if(this.data.name){
				if(!this.isNullOrEmpty(filter)){
					filter = `${filter} and contains(tolower(name), tolower('${this.data.name}'))`
				}
				else {
					filter = `contains(tolower(name), tolower('${this.data.name}'))`
				}
			}
		}
		return filter;
	}

	getOrganizations() {
		let options = {
			filter: this.getFilter()
		}
		this.dataLists = [];
		this.loading = true;
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						this.updateMassesesToOrg(item);
						if (item.photo) {
							item.pictureUrl = `${GlobalSettings.Settings.Server}/${item.photo}`;
						}
						else {
							item.pictureUrl = "../../assets/icons/ic_church_24dp.svg"
						}
					}
				}
				this.dataLists = items;
				this.loading = false;
			}
		})
	}

	updateMassesesToOrg(item: any){
		let options = {
			filter: `entityId eq ${item.id} and entityType eq 'organization'`
		}
		item.arrMasseses = [];
		this.service.getMasseses(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				item.arrMasseses = items;
			}
		})
	}
}
