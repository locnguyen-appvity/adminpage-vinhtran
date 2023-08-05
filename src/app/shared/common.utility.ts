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

	export function getFilterDate(data: any) {
		let filterDate = {
			fromDate: null,
			toDate: null,
			previousFrom: null,
			previousTo: null
		}
		switch (data.key) {
			case 'week':
				if (data.date && data.date.fromDate) {
					filterDate.fromDate = data.date.fromDate.clone().startOf('week');
					filterDate.toDate = data.date.fromDate.clone().endOf('week');
					filterDate.previousFrom = data.date.fromDate.clone().startOf('week').subtract(1, 'w');
					filterDate.previousTo = data.date.fromDate.clone().endOf('week').subtract(1, 'w');
				}
				break;
			case 'month':
				if (data.date && data.date.fromDate) {
					filterDate.fromDate = data.date.fromDate.clone().startOf('month');
					filterDate.toDate = data.date.fromDate.clone().endOf('month');
					filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'M');
					filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'M').endOf('month');
				}
				break;
			case 'custom':
				if (data.date && data.date.fromDate) {
					filterDate.fromDate = data.date.fromDate.clone();
					filterDate.previousFrom = data.date.fromDate.clone();
				}
				if (data.date && data.date.toDate) {
					filterDate.toDate = data.date.toDate.clone();
					filterDate.previousTo = data.date.toDate.clone();
				}
				break;
			case 'day':
				if (data.date && data.date.fromDate) {
					filterDate.fromDate = data.date.fromDate;
					filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'd');
					filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'd');
				}
				break;
			case 'quarter':
				if (data.date && data.date.fromDate) {
					filterDate.fromDate = data.date.fromDate.clone().startOf('quarter');
					filterDate.toDate = data.date.fromDate.clone().endOf('quarter');
					filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'Q');
					filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'Q').endOf('quarter');
				}
				break;
			case 'year':
				if (data.date && data.date.fromDate) {
					filterDate.fromDate = data.date.fromDate.clone();
					filterDate.toDate = data.date.fromDate.clone().endOf('year');
					filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'y');
					filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'y').endOf('year');
				}
				break;
		}
		return filterDate;
	}

	export function getDateRangeFilterToolbar(filterDate: any, key: string, target: string) {
		let filter = '';
		if (target === 'custom') {
			if (filterDate.fromDate) {
				filter = `${key} ge ${filterDate.fromDate}`;
				if (filterDate.toDate) {
					filter = `${key} ge ${filterDate.fromDate} and ${key} le ${filterDate.toDate}`;
				}
			}
			else {
				if (filterDate.toDate) {
					filter = `${key} le ${filterDate.toDate}`;
				}
			}
		}
		else {
			if (filterDate.fromDate) {
				filter = `${key} eq ${filterDate.fromDate}`;
				if (filterDate.toDate) {
					filter = `${key} ge ${filterDate.fromDate} and ${key} le ${filterDate.toDate}`;
				}
			}
			else {
				if (filterDate.toDate) {
					filter = `${key} eq ${filterDate.toDate}`;
				}
			}
		}
		return filter;
	}

	export function getDateFormatString(data: any, pattern?: string, dateFormat?: string) {
        if (!this.isNullOrEmpty(data)) {
            switch (pattern) {
                case "fullDateTimePattern":
                    return data.format("dddd, MMMM DD, hh:mma");
                case "fullDateTimePattern1":
                    return data.format("dddd YYYY-MM-DD HH:mm:ss");
                case "dateTimePattern":
                    return data.format("MMM DD YYYY, h:mm:ss A");
                case "dateTimePattern1":
                    return data.format("MM/DD/YYYY, hh:mm A");
                case "dateTimePattern2":
                    return data.format("MM/DD/YYYY hh:mm A");
                case "dateTimePattern3":
                    return data.format("MMM DD YYYY h:mm:ss A");
                case "dateTimePattern4":
                    return data.format("MM/DD/YYYY hh:mm A");
                case "dateTimePattern5":
                    return data.format("MMM DD YYYY hh:mm:ss A");
                case "dateTimePattern6":
                    return data.format("MMM DD, YYYY hh:mm A");
                case "dateTimePattern7":
                    return data.format("LLLL");
                case "dateTimePattern8":
                    return data.format("MM/DD/YYYY, HH:mm");
                case "dateTimePattern9":
                    return data.format("DD MMM, YY hh:mm A");
                case "dateTimePattern10":
                    return data.format("DD MMM, YYYY hh:mm A");
                case "dateTimePattern11":
                    return data.format("DD MMM YYYY, hh:mm A");
                case "dateTimePattern12":
                    return data.format("MMM DD, YYYY, hh:mm A");
                case "dateTimePattern15":
                    return data.format("MMM DD, YYYY, HH:mm");
                case "dateTimePattern16":
                    return data.format("DD MMM YYYY, HH:mm");
                case "shortDatePattern":
                    return data.format("MMM DD YYYY");
                case "shortDatePattern1":
                    return data.format("MMMM DD, YYYY");
                case "shortDatePattern2":
                    return data.format("MMMM DD YYYY");
                case "shortDatePattern3":
                    return data.format("MMMM DD");
                case "shortDatePattern4":
                    return data.format("MMM DD");
                case "shortDatePattern5":
                    return data.format("MM/DD/YYYY");
                case "shortDatePattern6":
                    return data.format("DD MMM YYYY");
                case "shortDatePattern7_MZ":
                    return data.format("YYYY/MM/DD");
                case "shortDatePattern7":
                    return data.format("MM/DD/YY - hh:mm:ss A");
                case "shortDatePattern8":
                    return data.format("YYYY-MM-DD HH:mm:ss");
                case "shortDatePattern9":
                    return data.format("ddd, DD MMM, YYYY");
                case "shortDatePattern10":
                    return data.format("DD MMM, YYYY");
                case "shortDatePattern11":
                    return data.format("DD MMM YY");
                case "shortDatePattern12":
                    return data.format("MM/DD/YYYY h:mm:ss A");
                case "timePattern":
                    return data.format("h:mm:ss A");
                case "timePatternAM":
                    return data.format("h:mm A");
                case "timePatternAM2":
                    return data.format("hh:mm A");
                case "timePatternAM3":
                    return data.format("hh:mm:ss A");
                case "timePatternAM4":
                    return data.format("HH:mm");
                case "monthYearPattern":
                    return data.format("MMMM, YYYY");
                case "fullDatePattern":
                    return data.format("ddd, DD MMM, YYYY");
                case "fullDatePattern1":
                    return data.format("ddd DD MMM, YYYY");
                case "fullDatePattern_MZ":
                    return data.format("ddd, DD MMM YY");
                case "fullDatePattern2":
                    return data.format("DD/MM/yyyy");
                case "datePatternFormat1":
                    return data.format(dateFormat + " " + "hh:mm A");
                default:
                    // Otherwise, return the date formatted as requested.
                    return data.format(pattern);
            }
        }
    }
}
