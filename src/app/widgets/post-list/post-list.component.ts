import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'se-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnChanges {

  public posts = [
    {
      title: 'Hội dòng mến thánh giá thủ thiêm trong ngày gặp mặt với lương dân, chủ đề “có chúa trong đời”',
      discription: 'Hôm nay lúc 7g15 ngày 03/5/2023, tại Trung tâm Mục vụ giáo phận Phú Cường, có cuộc gặp gỡ giữa những người chưa nhận biết Chúa, những người vì lý do riêng đã xa Chúa được đến đây trong niềm vui, trong tình thương để nhận ra “có Chúa trong đời”. Đó cũng là mục đích, lý tưởng sống trong vườn ươm ơn gọi thiêng liêng của Hội dòng Mến Thánh Giá Thủ Thiêm có nhiều cộng đoàn đang hoạt động nơi giáo phận Phú Cường',
      imgUrl: 'https://giaophanphucuong.org//Image/_thumbs/Picture/Images/cao-pho-bo-cha-dom.png',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    },
    {
      title: 'Sứ điệp của ĐTC cho ngày Thế giới Người Di dân và Người Tị nạn lần thứ 109 (2023)”',
      discription: 'Trong Sứ điệp cho ngày Thế giới Người Di dân và Người Tị nạn năm 2023, có tựa đề “Tự do chọn di cư hay ở lại”, được công bố vào thứ Năm 11/5/2023, Đức Thánh Cha tái khẳng định quyền không di cư, nghĩa là quyền được sống trong hòa bình và xứng nhân phẩm tại quê hương đất nước của mình',
      imgUrl: 'https://giaophanphucuong.org/Image/_thumbs/Picture/Images/Hinh-Suy-Niem/02-Nam-A/03%20Mua%20Phuc%20Sinh/Chua%20Nhat%20VII%20Mua%20Phuc%20Sinh/Chu%CC%81a%20Nha%CC%A3%CC%82t%20Chu%CC%81a%20Tha%CC%86ng%20Thie%CC%82n%20A%20-%205.jpg',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    },
    {
      title: 'Hội dòng mến thánh giá thủ thiêm trong ngày gặp mặt với lương dân, chủ đề “có chúa trong đời”',
      discription: 'Hôm nay lúc 7g15 ngày 03/5/2023, tại Trung tâm Mục vụ giáo phận Phú Cường, có cuộc gặp gỡ giữa những người chưa nhận biết Chúa, những người vì lý do riêng đã xa Chúa được đến đây trong niềm vui, trong tình thương để nhận ra “có Chúa trong đời”. Đó cũng là mục đích, lý tưởng sống trong vườn ươm ơn gọi thiêng liêng của Hội dòng Mến Thánh Giá Thủ Thiêm có nhiều cộng đoàn đang hoạt động nơi giáo phận Phú Cường',
      imgUrl: 'https://giaophanphucuong.org//Image/_thumbs/Picture/Images/cao-pho-bo-cha-dom.png',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    },
    {
      title: 'Sứ điệp của ĐTC cho ngày Thế giới Người Di dân và Người Tị nạn lần thứ 109 (2023)”',
      discription: 'Trong Sứ điệp cho ngày Thế giới Người Di dân và Người Tị nạn năm 2023, có tựa đề “Tự do chọn di cư hay ở lại”, được công bố vào thứ Năm 11/5/2023, Đức Thánh Cha tái khẳng định quyền không di cư, nghĩa là quyền được sống trong hòa bình và xứng nhân phẩm tại quê hương đất nước của mình',
      imgUrl: 'https://giaophanphucuong.org/Image/_thumbs/Picture/Images/Hinh-Suy-Niem/02-Nam-A/03%20Mua%20Phuc%20Sinh/Chua%20Nhat%20VII%20Mua%20Phuc%20Sinh/Chu%CC%81a%20Nha%CC%A3%CC%82t%20Chu%CC%81a%20Tha%CC%86ng%20Thie%CC%82n%20A%20-%205.jpg',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    },
    {
      title: 'Hội dòng mến thánh giá thủ thiêm trong ngày gặp mặt với lương dân, chủ đề “có chúa trong đời”',
      discription: 'Hôm nay lúc 7g15 ngày 03/5/2023, tại Trung tâm Mục vụ giáo phận Phú Cường, có cuộc gặp gỡ giữa những người chưa nhận biết Chúa, những người vì lý do riêng đã xa Chúa được đến đây trong niềm vui, trong tình thương để nhận ra “có Chúa trong đời”. Đó cũng là mục đích, lý tưởng sống trong vườn ươm ơn gọi thiêng liêng của Hội dòng Mến Thánh Giá Thủ Thiêm có nhiều cộng đoàn đang hoạt động nơi giáo phận Phú Cường',
      imgUrl: 'https://giaophanphucuong.org//Image/_thumbs/Picture/Images/cao-pho-bo-cha-dom.png',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    },
    {
      title: 'Sứ điệp của ĐTC cho ngày Thế giới Người Di dân và Người Tị nạn lần thứ 109 (2023)”',
      discription: 'Trong Sứ điệp cho ngày Thế giới Người Di dân và Người Tị nạn năm 2023, có tựa đề “Tự do chọn di cư hay ở lại”, được công bố vào thứ Năm 11/5/2023, Đức Thánh Cha tái khẳng định quyền không di cư, nghĩa là quyền được sống trong hòa bình và xứng nhân phẩm tại quê hương đất nước của mình',
      imgUrl: 'https://giaophanphucuong.org/Image/_thumbs/Picture/Images/Hinh-Suy-Niem/02-Nam-A/03%20Mua%20Phuc%20Sinh/Chua%20Nhat%20VII%20Mua%20Phuc%20Sinh/Chu%CC%81a%20Nha%CC%A3%CC%82t%20Chu%CC%81a%20Tha%CC%86ng%20Thie%CC%82n%20A%20-%205.jpg',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    },
    {
      title: 'Hội dòng mến thánh giá thủ thiêm trong ngày gặp mặt với lương dân, chủ đề “có chúa trong đời”',
      discription: 'Hôm nay lúc 7g15 ngày 03/5/2023, tại Trung tâm Mục vụ giáo phận Phú Cường, có cuộc gặp gỡ giữa những người chưa nhận biết Chúa, những người vì lý do riêng đã xa Chúa được đến đây trong niềm vui, trong tình thương để nhận ra “có Chúa trong đời”. Đó cũng là mục đích, lý tưởng sống trong vườn ươm ơn gọi thiêng liêng của Hội dòng Mến Thánh Giá Thủ Thiêm có nhiều cộng đoàn đang hoạt động nơi giáo phận Phú Cường',
      imgUrl: 'https://giaophanphucuong.org//Image/_thumbs/Picture/Images/cao-pho-bo-cha-dom.png',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    },
    {
      title: 'Sứ điệp của ĐTC cho ngày Thế giới Người Di dân và Người Tị nạn lần thứ 109 (2023)”',
      discription: 'Trong Sứ điệp cho ngày Thế giới Người Di dân và Người Tị nạn năm 2023, có tựa đề “Tự do chọn di cư hay ở lại”, được công bố vào thứ Năm 11/5/2023, Đức Thánh Cha tái khẳng định quyền không di cư, nghĩa là quyền được sống trong hòa bình và xứng nhân phẩm tại quê hương đất nước của mình',
      imgUrl: 'https://giaophanphucuong.org/Image/_thumbs/Picture/Images/Hinh-Suy-Niem/02-Nam-A/03%20Mua%20Phuc%20Sinh/Chua%20Nhat%20VII%20Mua%20Phuc%20Sinh/Chu%CC%81a%20Nha%CC%A3%CC%82t%20Chu%CC%81a%20Tha%CC%86ng%20Thie%CC%82n%20A%20-%205.jpg',
      dateView: '15/02/2023',
      countView: 12,
      category: 'Tin Giáo Hội'
    }
  ]
  public title: string = "Thông Báo";
  @Input() rows: number = 5;

  constructor() { 
    this.posts = this.posts.slice(0, this.rows);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.posts = this.posts.slice(0, this.rows);
    }
  }

}
