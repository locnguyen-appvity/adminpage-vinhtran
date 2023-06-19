import { Component } from '@angular/core';
import { SimpleBaseComponent } from '../shared/simple.base.component';
import { SharedPropertyService } from '../shared/shared-property.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends SimpleBaseComponent {

  public iNotification: number = 10;
  public notifications: any[] = [
    {
      title: "Vinh Trần Đức",
      read: false,
      message: "Đã tạo mới sách nói: 'Đường Theo Chúa Có Sướng Có Khổ'",
      time: "Khoảng 2 giờ trước"
    }
  ];
  constructor(
    public override sharedService: SharedPropertyService
  ) {
    super(sharedService);
  }

  markAsReadNotification(item: any) {

  }

  markAsUnReadNotification(item: any) {

  }

}
