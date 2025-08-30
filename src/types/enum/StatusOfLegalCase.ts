export const StatusOfLegalCase = {
    TEMPORARY_SUSPENSION: "Tạm đình chỉ",
    OVERDUE: "Quá hạn",
    CANCELED: "Án hủy",
    EDITED: "Án sửa",
    WAITING_FOR_ASSIGNMENT: "Chờ được phân công",
    IN_PROCESS: "Đang giải quyết",
    SOLVED: "Đã được giải quyết"
} as const;

export type StatusOfLegalCase = typeof StatusOfLegalCase[keyof typeof StatusOfLegalCase];
