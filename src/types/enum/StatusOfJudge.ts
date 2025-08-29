export const StatusOfJudge = {
    WORKING: "Đang làm việc",
    NOT_WORKING: "Không còn làm việc",
    ON_BUSINESS_TRIP: "Đang công tác",
    ON_LEAVE: "Đang nghĩ phép",
    DISCIPLINED: "Đang bị kĩ luật",
} as const;

export type StatusOfJudge = typeof StatusOfJudge[keyof typeof StatusOfJudge];
