export module CommonUtility {
	export function getCurrentPositionClergy(items: any) {
		if (items && items.length > 0) {
			for (let item of items) {
				if (item.position == 'chanh_xu') {
					return item;
				}
			}
			for (let item of items) {
				if (item.position == 'pho_xu') {
					return item;
				}
			}
			return items[0];
		}
		return null;
	}

	export function convertDayEngToVi(day: string) {
		let key = day ? day.toLocaleLowerCase() : "";
		switch (key) {
			case 'monday':
				return "Thứ hai"
			case 'tuesday':
				return "Thứ ba"
			case 'wednesday':
				return "Thứ tư"
			case 'thursday':
				return "Thứ năm"
			case 'friday':
				return "Thứ sáu"
			case 'saturday':
				return "Thứ bảy"
			case 'sunday':
				return "Chúa Nhật"
			default:
				return day;
		}
	}

	export function isNullOrEmpty(data: any) {
        if (data === null || data === "" || data === undefined) {
            return true;
        }
        return false;
    }

    export function isNullOrEmptyZero(data: any) {
        if (data === null || data === "" || data === undefined || data === 0) {
            return true;
        }
        return false;
    }

	export function getFileIcon(fileName: string) {
		let svgIcon = 'ic_document_file';
		if (!isNullOrEmpty(fileName)) {
			let format = fileName.split('.').pop();
			if (!isNullOrEmpty(format)) {
				format = format.toLowerCase();
			}
			switch (format) {
				case 'zip':
					svgIcon = 'ic_zip_file';
					break;
				case 'mp3':
				case 'm4a':
				case 'ogg':
				case 'wav':
					svgIcon = 'ic_audio_file';
					break;
				case 'mp4':
				case 'm4v':
				case 'mov':
				case 'wmv':
				case 'avi':
				case 'mpg':
				case 'ogv':
				case '3gp':
				case '3g2':
					svgIcon = 'ic_video_file';
					break;
				case 'jpg':
				case 'jpeg':
				case 'png':
				case 'gif':
				case 'ico':
					svgIcon = 'ic_image_file';
					break;
				case 'doc':
				case 'docx':
					svgIcon = 'ic_word_file';
					break;
				case 'ppt':
				case 'pptx':
				case 'pps':
				case 'ppsx':
					svgIcon = 'ic_powerpoint_file';
					break;
				case 'xls':
				case 'xlsx':
					svgIcon = 'ic_excel_file';
					break;
				case 'pdf':
					svgIcon = 'ic_pdf_file';
					break;
				case 'psd':
				case 'odt':
				case 'txt':
				case 'xml':
				case 'kml':
					svgIcon = 'ic_document_file';
					break;
			}
		}
		return svgIcon;
	}
}
