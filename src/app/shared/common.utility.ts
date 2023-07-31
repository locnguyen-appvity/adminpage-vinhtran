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
}
