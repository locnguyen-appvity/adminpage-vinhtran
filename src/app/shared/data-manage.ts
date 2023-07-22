export const ANNIVERSARIES = [
    {
        name: "Ngày Sinh",
        type: "birth",
        typeClergy: "all",
        typeOrg: "",
    },
    {
        name: "Ngày Thành Lập",
        type: "birth",
        typeClergy: "",
        typeOrg: "all",
    },
    {
        name: "Rửa Tội",
        type: "baptize",
        typeClergy: "all",
        typeOrg: "",
    },
    {
        name: "Bổn Mạng",
        type: "saint",
        typeClergy: "all",
        typeOrg: "all",
    },
    {
        name: "Thêm Sức",
        type: "confirmation",
        typeClergy: "all",
        typeOrg: "",
    },
    {
        name: "Đại Chủng Viện",
        type: "bigSeminary",
        typeClergy: "tu_trieu",
        typeOrg: "",
    },
    {
        name: "Tiểu Chủng Viện",
        type: "smallSeminary",
        typeClergy: "tu_trieu",
        typeOrg: "",
    },
    {
        name: "Tiểu Chủng Viện",
        type: "vow",
        typeClergy: "tu_dong",
        typeOrg: "",
    }
    // {
    //     name: "Ngày Mất",
    //     entityID: "",
    //     entityType: "",
    //     date: "",
    //     day: "",
    //     description: "",
    //     type: "rip",
    //     content: "",
    //     locationID: "",
    //     locationType: "",
    //     status: "active"
    // }
]

export const LEVEL_CLERGY = [
    {
        name: 'Giám Mục',
        code: 'giam_muc'
    },
    {
        name: 'Linh Mục',
        code: 'linh_muc'
    },
    {
        name: 'Phó Tế',
        code: 'pho_te'
    },
    {
        name: 'Thầy',
        code: 'thay'
    },
    {
        name: 'Tu Sĩ',
        code: 'tu_si'
    },
    {
        name: 'Khác',
        code: 'khac'
    }
]

export const STATUS_CLERGY = [
    {
        name: 'Đương Nhiệm',
        code: 'duong_nhiem'
    },
    {
        name: 'Mãn Nhiệm',
        code: 'man_nhiem'
    }
]

export const LEVEL_POSITION = [
    {
        name: 'Giáo Phận',
        code: 'giao_phan'
    },
    {
        name: 'Giáo Hạt',
        code: 'giao_hat'
    },
    {
        name: 'Giáo Xứ',
        code: 'giao_xu'
    },
    {
        name: 'Dòng Tu',
        code: 'dong_tu'
    },
    {
        name: 'Khác',
        code: 'khac'
    }
]

export const LTYPE_ORG = [
    {
        name: 'Giáo Hạt',
        code: 'giao_hat',
        group:'group'
    },
    {
        name: 'Giáo Xứ',
        code: 'giao_xu',
        group:'organization'
    },
    {
        name: 'Giáo Điểm',
        code: 'giao_diem',
        group:'organization'
    },
    {
        name: 'Giáo Họ',
        code: 'giao_ho',
        group:'organization'
    },
    {
        name: 'Dòng Tu',
        code: 'dong_tu',
        group:'group'
    },
    {
        name: 'Cơ Sở Giáo Phận',
        code: 'co_so_giao_phan',
        group:'group'
    },
    {
        name: 'Ban Mục Vụ',
        code: 'ban_muc_vu',
        group:'group'
    },
    {
        name: 'Ban Chuyên Môn',
        code: 'ban_chuyen_mon',
        group:'group'
    }
]
// export const POSITION = [
//     {
//         name: 'Chánh xứ',
//         code: 'chanh_xu'
//     },
//     {
//         name: 'Phó Xứ',
//         code: 'pho_xu'
//     },
//     {
//         name: 'Phó Biệt Cư',
//         code: 'pho_biet_cu'
//     },
//     {
//         name: 'Quản xứ',
//         code: 'quan_xu'
//     },
//     {
//         name: 'Quản hạt',
//         code: 'quan_hat'
//     },
//     {
//         name: 'Giúp xứ',
//         code: 'giúp_xu'
//     },
//     {
//         name: 'Hưu',
//         code: 'huu'
//     },
//     {
//         name: 'Khác',
//         code: 'khac'
//     }
// ]
export const TYPE_ORG = [
    {
        name: 'Giáo Xứ',
        code: 'giao_xu'
    },
    {
        name: 'Giáo Điểm',
        code: 'giao_diem'
    },
    {
        name: 'Cơ Sở Giáo Phận',
        code: 'co_so_giao_phan'
    },
    {
        name: 'Dòng Tu',
        code: 'dong_tu'
    },
    {
        name: 'Cộng Đoàn',
        code: 'cong_doan'
    },
    {
        name: 'Khác',
        code: 'khac'
    }
]