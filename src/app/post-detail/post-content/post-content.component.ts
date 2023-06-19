import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss']
})
export class PostContentComponent implements OnInit {

  public title: string = 'Episode 04: Bí quyết hạnh phúc gia đình | Phần 01: Hôn Nhân – Gia Đình | Trò chuyên với các bạn trẻ công giáo';
  public content: string = `
  <div style="text-align: center;">
  <img alt="" src="https://giaophanphucuong.org/Image/Picture/TinTuc/TinGiaoPhan/album/GxHungHoa/2023/bemacthanghoa/2023-gxhunghoa-bemacthanghoa-1.jpg" style="width: 600px; height: 450px;">
  </div>
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Thành ngữ<strong> “nằm gai nếm mật”</strong> có nghĩa đen là<strong> “nằm trên gai nhọn, nếm giọt mật đắng</strong>”, còn nghĩa bóng chỉ hành động tự đầy ải thân mình nhằm nuôi chí phục thù.</span></span></p>
  
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Như vậy, thành ngữ <strong>“nằm gai nếm mật”</strong> chỉ sự vất vả, hy sinh và chịu đựng mọi gian nan để mưu cầu việc lớn.</span></span></p>
  
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Thành ngữ “nằm gai nếm mật” dịch từ thành ngữ <strong>“ngoạ tân thường đảm”</strong>: <strong>“ngoạ tân”</strong> là nằm gai, <strong>“thường đảm”</strong> là nếm mật.</span></span></p>
  
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Từ đó, thành ngữ<strong> “nằm gai nếm mật” </strong>được sử dụng rộng rãi trong dân gian và trên văn đàn chỉ sự chịu đựng gian khổ, quyết chí mưu đồ việc lớn.</span></span></p>
  
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">“Mấy thu <strong>nếm mật nằm gai</strong>,<br>
  Thề lòng trả được giận dài mới yên”<br>
  (Nguyễn Đình Chiểu)</span></span></p>
  
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">Chúng ta có thể ứng dụng thành ngữ này như sau:</span></span></p>
  
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">- Muốn làm nên đại sự, nhất thiết phải chấp nhận <strong>“nằm gai nếm mật”</strong>.</span></span></p>
  
  <p style="text-align: justify;"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;">- Con đừng nản chí, cứ chịu khó <strong>“nằm gai nếm mật” </strong>một thời gian, ắt sẽ thành công.</span></span></p>`
  
  public description: string = `Thành ngữ là một thể loại văn học dân gian, được ông cha ta đúc kết qua bao đời. Nó được sử dụng rộng rãi trong lời ăn, tiếng nói hằng ngày. Nó cũng là “chất liệu” để sáng tác thơ ca, văn học. Thành ngữ thường ngắn gọn nhưng ý tứ rất phong phú và sâu sắc, nó cho ta nhiều bài học thú vị...`
  constructor() { }

  ngOnInit(): void {
  }

}
