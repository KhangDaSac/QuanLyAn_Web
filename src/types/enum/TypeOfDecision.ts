export const TypeOfDecision = {
    EXTENSION_DECISION: "Quyết định gia hạn",
    SUSPENSION_DECISION: "Quyết định đình chỉ",
    CONTINUATION_DECISION: "Quyết định tiếp tục",
    ADDITIONAL_ACCEPTANCE_DECISION: "Quyết định thụ lý bổ sung",
    CANCELLATION_DECISION: "Quyết định hủy án",
    AMENDMENT_DECISION: "Quyết định sửa án",
} as const;

export type TypeOfDecision = typeof TypeOfDecision[keyof typeof TypeOfDecision];
