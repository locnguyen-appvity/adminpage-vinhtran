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
}
