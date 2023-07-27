export function getHtmlExport(localItem: any, appointments: any) {
    return `
    <html>
    
    <head>
    <meta charset="UTF-8">
    <title>GIÁO PHẬN PHÚ CƯỜNG</title>
    
    </head>
    
    <body lang=EN-US style='word-wrap:break-word'>
    
        <table style="border-collapse:collapse;width: 100%;">
            <tbody>
                <tr>
                    <td style="width: 70%;vertical-align: top;"><span style="font-family: &quot;times new roman&quot;, times, serif;">
                    <span style="font-size: 18px;">
                                <strong style="font-family: &quot;times new roman&quot;, times, serif;">GIÁO PHẬN PHÚ CƯỜNG</strong><br>
                                <strong style="font-family: &quot;times new roman&quot;, times, serif;">${localItem.displayName} ${localItem.name}</strong></span><br>
                                Châm ngôn Linh mục: ${localItem.parable ? localItem.parable : ""}</span>
                        <div style="color:rgba(0,0,0,0.01);width:0;height:0"><span
                                style="font-family: &quot;times new roman&quot;, times, serif;">&nbsp;<br></span></div>
                    </td>
                    <td style="width: 20%;">
                    <div style="width: auto;height: 80px;object-fit: cover;">
                    <img src="${localItem.pictureUrl}">
                    </div>
                    </td>
                    <td style="width: 10%;">
                   
                    </td>
                </tr>
            </tbody>
        </table>
        <p style="text-align: center;"><span style="font-family: &quot;times new roman&quot;, times, serif;"><strong
                    style="font-size: 24px;">CURRICULUM VITAE</strong></span></p>
        <p style="line-height: 2;"><span
                style="font-family: &quot;times new roman&quot;, times, serif; font-size: 16px;">
                
                <span>Tên thánh: <strong>${localItem.stName ? localItem.stName : "Chưa cập nhật"}</strong></span><br>
                <span>Họ và tên: <strong>${localItem.name ? localItem.name : "Chưa cập nhật"}</strong></span><br>
                <span>Sinh ngày: <strong>${localItem.dateOfBirthView ? localItem.dateOfBirthView : "Chưa cập nhật"}</strong></span><br>
                <span>Tại: <strong>${localItem.placeOfBirth ? localItem.placeOfBirth : "Chưa cập nhật"}</strong></span><br>
                <span><span>Giáo xứ : <strong>${localItem.orgName ? localItem.orgName : "Chưa cập nhật"}</strong></span>.............<span>Gáo phận: <strong>diocesName Phú Cường</strong></span></span><br>
                <span>Tên thánh, họ và tên cha: <strong>${localItem.fatherName ? localItem.fatherName : "Chưa cập nhật"}</strong></span><br>
                <span>Tên thánh, họ và tên mẹ: <strong>${localItem.motherName ? localItem.motherName : "Chưa cập nhật"}</strong></span><br>
                <span><span>Rửa tội tại giáo xứ: <strong>${localItem.anniversaries.baptize ? localItem.anniversaries.baptize.locationName : "Chưa cập nhật"}</strong></span>.............<span>ngày: <strong>${localItem.anniversaries.baptize ? localItem.anniversaries.baptize.dateView : "Chưa cập nhật"}</strong></span></span><br>
                Thêm sức tại giáo xứ: <strong>${localItem.anniversaries.confirmation ? localItem.anniversaries.confirmation.locationName : "Chưa cập nhật"}</strong>.............<span>ngày: <strong>${localItem.anniversaries.confirmation ? localItem.anniversaries.confirmation.dateView : "Chưa cập nhật"}</strong></span><br>
                Vào Tiểu Chủng viện: <strong>${localItem.anniversaries.smallSeminary ? localItem.anniversaries.smallSeminary.locationName : "Chưa cập nhật"}</strong>.............<span>ngày: <strong>${localItem.anniversaries.smallSeminary ? localItem.anniversaries.smallSeminary.dateView : "Chưa cập nhật"}</strong></span><br>
                Vào Đại Chủng viện: <strong>${localItem.anniversaries.bigSeminary ? localItem.anniversaries.bigSeminary.locationName : "Chưa cập nhật"}</strong>.............<span>ngày: <strong>${localItem.anniversaries.bigSeminary ? localItem.anniversaries.bigSeminary.dateView : "Chưa cập nhật"}</strong></span><br>
                Chịu chức Phó tế tại: <strong>${localItem.anniversaries.pho_te ? localItem.anniversaries.pho_te.locationName : "Chưa cập nhật"}</strong>.............<span>ngày: <strong>${localItem.anniversaries.pho_te ? localItem.anniversaries.pho_te.dateView : "Chưa cập nhật"}</strong></span><br>
                Chịu chức Linh mục tại: <strong>${localItem.anniversaries.linh_muc ? localItem.anniversaries.linh_muc.locationName : "Chưa cập nhật"}</strong>.............<span>ngày: <strong>${localItem.anniversaries.linh_muc ? localItem.anniversaries.linh_muc.dateView : "Chưa cập nhật"}</strong></span><br>
                do Đức Giám mục : <strong>${localItem.anniversaries.linh_muc ? localItem.anniversaries.linh_muc.description : "Chưa cập nhật"}</strong><br>
                Linh mục gốc Giáo phận (được tính từ ngày chịu chức Phó tế): <strong>Phú Cường</strong><br>
                Gia nhập hàng giáo sỹ Giáo phận Phú Cường ngày: <strong>10-10-1987</strong><br>
                Gia nhập vĩnh viễn Giáo phận: <strong>Phú Cường</strong><br>
                Số ${localItem.identityCardTypeView ? localItem.identityCardTypeView : "Chưa cập nhật"}: <strong>${localItem.identityCardNumber ? localItem.identityCardNumber : "Chưa cập nhật"}</strong>
                .............cấp ngày: <strong>${localItem.identityCardIssueDateView ? localItem.identityCardIssueDateView : "Chưa cập nhật"}</strong>
                .............nơi cấp: <strong>${localItem.identityCardIssuePlace ? localItem.identityCardIssuePlace : "Chưa cập nhật"}</strong></span>
                </p>

                <p style="line-height: 3;"><span style="font-family: &quot;times new roman&quot;, times, serif; font-size: 16px;"><strong style="font-family: &quot;times new roman&quot;, times, serif; font-size: 18px;">Từ khi chịu chức linh mục đã làm gì? ở đâu?</strong></span></p>

    ${getHtmlAppointments(appointments)}
        
        <p><strong>Ghi chú</strong> <em>(dành riêng cho Giám mục):</em></p>
        <p style="line-height: 1.4;">
            <em>..................................................................................................................................................................................................................................................................................................................................................................................................................................</em>
        </p>
        <p style="line-height: 1.4;">Linh mục qua đời
            lúc:.................................ngày:...............................................................................................
        </p>
        <p style="line-height: 1.4;">
            tại..........................................................................................................................................................................
        </p>
    
    </body>
    
    </html>
    `
}

export function getHtmlAppointments(appointments: any) {
    let trAppointments = [];
    if (appointments && appointments.length > 0) {
        let index = 1;
        for (let it of appointments) {
            trAppointments.push(`
            <tr style="text-align: center;">
            <td style="border-top:none;border-left:
none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;border-left:solid windowtext 1.0pt;">${index}
            </td>
            <td style="border-top:none;border-left:
none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;">${it.positionView}</td>
            <td style="border-top:none;border-left:
none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;">${it.entityName}</td>
            <td style="border-top:none;border-left:
none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;">${it.fromDateView ? it.fromDateView : ""}</td>

            <td style="border-top:none;border-left:
none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;">${it.toDateView ? it.toDateView : ""}</td>
        </tr>
            `)
            index++;
        }
        return `<table style="border-collapse:collapse;width: 100%;">
        <tbody>
            <tr>
                <td style="width: 12.6294%; text-align: center;border:solid windowtext 1.0pt;
    padding:0in 5.4pt 0in 5.4pt;height:5.65pt"><strong>STT</strong></td>
                <td style="width: 18.8406%; text-align: center;border:solid windowtext 1.0pt;
    padding:0in 5.4pt 0in 5.4pt;height:5.65pt"><strong>CHỨC VỤ</strong></td>
                <td style="width: 19.6687%; text-align: center;border:solid windowtext 1.0pt;
    padding:0in 5.4pt 0in 5.4pt;height:5.65pt"><strong>ĐỊA ĐIỂM</strong></td>
                <td style="width: 21.7391%; text-align: center;border:solid windowtext 1.0pt;
    padding:0in 5.4pt 0in 5.4pt;height:5.65pt"><strong>THỜI GIAN ĐẾN</strong></td>
                <td style="width: 27.0186%; text-align: center;border:solid windowtext 1.0pt;
    padding:0in 5.4pt 0in 5.4pt;height:5.65pt"><strong>THỜI GIAN ĐI</strong></td>
            </tr>
           ${trAppointments.join()}
        </tbody>
    </table>`
    }
    return ''
}