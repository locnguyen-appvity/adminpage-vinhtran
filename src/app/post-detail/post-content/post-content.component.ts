import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-post-content',
	templateUrl: './post-content.component.html',
	styleUrls: ['./post-content.component.scss']
})
export class PostContentComponent extends SimpleBaseComponent implements OnChanges {

	@Input() id: string;
	@Input() type: string = 'post';
	public title: string = 'Episode 04: Bí quyết hạnh phúc gia đình | Phần 01: Hôn Nhân – Gia Đình | Trò chuyên với các bạn trẻ công giáo';
	public description: string = `Thành ngữ là một thể loại văn học dân gian, được ông cha ta đúc kết qua bao đời. Nó được sử dụng rộng rãi trong lời ăn, tiếng nói hằng ngày. Nó cũng là “chất liệu” để sáng tác thơ ca, văn học. Thành ngữ thường ngắn gọn nhưng ý tứ rất phong phú và sâu sắc, nó cho ta nhiều bài học thú vị...`
	public localItem: any;
	constructor(
		public sharedService: SharedPropertyService,
		private service: SharedService,
	) {
		super(sharedService);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['id'] || changes['type']) {
			if (!this.isNullOrEmpty(this.id) && !this.isNullOrEmpty(this.type)) {
				this.getDetail();
			}

		}
	}

	getDetail() {
		if (this.type == 'post') {
			this.getPost();
		}
		else if (this.type == 'contemplation') {
			this.getContemplation();
		}
	}

	getPost() {
		this.service.getPost(this.id).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					if (this.localItem.photo) {
						this.localItem.pictureUrl = `${GlobalSettings.Settings.Server}/${this.localItem.photo}`;
					}
					if (this.localItem.created) {
						this.localItem._created = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.created);
						this.localItem.createdView = this.localItem._created.format("DD/MM/YYYY HH:mm");
					}
				}
			}
		})
	}

	getContemplation() {
		this.service.getContemplation(this.id).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem._metaKeyword = [];
					if (this.localItem.metaKeyword) {
						this.localItem._metaKeyword = this.localItem.metaKeyword.split('~');
					}
					if (this.localItem.photo) {
						this.localItem.pictureUrl = `${GlobalSettings.Settings.Server}/${this.localItem.photo}`;
					}
					if (this.localItem.created) {
						this.localItem._created = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.created);
						this.localItem.createdView = this.localItem._created.format("DD/MM/YYYY HH:mm");
					}
				}
			}
		})
	}

}
