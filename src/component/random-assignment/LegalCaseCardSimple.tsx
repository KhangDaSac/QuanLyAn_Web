import { useState } from "react";
import { type LegalCaseResponse } from "../../types/response/legal-case/LegalCaseResponse";
import { LitigantType } from "../../types/enum/LitigantType";

interface LegalCaseCardSimpleProps {
  legalCase: LegalCaseResponse;
  isSelected: boolean;
  onSelect: (caseId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const LegalCaseCardSimple = ({
  legalCase,
  isSelected,
  onSelect,
}: LegalCaseCardSimpleProps) => {
  const [showAllPlaintiffs, setShowAllPlaintiffs] = useState(false);
  const [showAllDefendants, setShowAllDefendants] = useState(false);
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border ${
        isSelected
          ? "border-red-500 bg-red-50"
          : "border-gray-200 hover:border-gray-300"
      } p-4 md:p-6`}
      onClick={() => onSelect(legalCase.legalCaseId)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Số thụ lý: {legalCase.acceptanceNumber}
          </h3>
          <p className="text-sm text-gray-500">ID: {legalCase.legalCaseId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(legalCase.legalCaseId)}
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      <div className="mb-4">
        {legalCase.litigants && legalCase.litigants.length > 0 ? (
          <>
            {(() => {
              const plaintiffs = legalCase.litigants.filter(
                (l) =>
                  l.litigantType == ("PLAINTIFF" as LitigantType) ||
                  l.litigantType == ("DEFENDANT" as LitigantType)
              );
              const defendants = legalCase.litigants.filter(
                (l) => l.litigantType == ("DEFENDANT" as LitigantType)
              );

              return (
                <div className="grid grid-cols-2 gap-4">
                  {/* Cột trái: Nguyên đơn / Bị cáo */}
                  <div className="space-y-3">
                    {(showAllPlaintiffs
                      ? plaintiffs
                      : plaintiffs.slice(0, 2)
                    ).map((litigant, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-17 h-17 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-10 h-10 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 mb-1">
                            {legalCase.legalRelationship.legalCaseType
                              .codeName == "HS"
                              ? "Bị cáo"
                              : "Nguyên đơn"}
                          </p>
                          <p className="text-base font-semibold text-gray-900 truncate">
                            {litigant.name +
                              (litigant.yearOfBirth
                                ? " - " + litigant.yearOfBirth
                                : "")}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {litigant.address}
                          </p>
                        </div>
                      </div>
                    ))}
                    {plaintiffs.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllPlaintiffs(!showAllPlaintiffs);
                        }}
                        className="w-full text-sm text-orange-600 font-semibold flex items-center justify-center gap-2 py-2 bg-orange-50 rounded-lg border border-orange-200">
                        {showAllPlaintiffs ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            Thu gọn
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            Xem thêm {plaintiffs.length - 2} người
                          </>
                        )}
                      </button>
                    )}
                    {plaintiffs.length === 0 && (
                      <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded-lg border border-gray-200">
                        Không có dữ liệu
                      </div>
                    )}
                  </div>

                  {/* Cột phải: Bị đơn */}
                  <div className="space-y-3">
                    {(showAllDefendants
                      ? defendants
                      : defendants.slice(0, 2)
                    ).map((litigant, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-17 h-17 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 mb-1">Bị đơn</p>
                          <p className="text-base font-semibold text-gray-900 truncate">
                            {litigant.name +
                              (litigant.yearOfBirth
                                ? " - " + litigant.yearOfBirth
                                : "")}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {litigant.address}
                          </p>
                        </div>
                      </div>
                    ))}
                    {defendants.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllDefendants(!showAllDefendants);
                        }}
                        className="w-full text-sm text-rose-600 font-semibold flex items-center justify-center gap-2 py-2 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors">
                        {showAllDefendants ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            Thu gọn
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            Xem thêm {defendants.length - 2} người
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            Chưa có thông tin đương sự
          </div>
        )}
      </div>

      {/* Quan hệ pháp luật */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-600 mb-1">
          {legalCase.legalRelationship.legalCaseType.codeName == "HS"
            ? "Tội"
            : "Quan hệ pháp luật"}
        </p>
        <p className="text-base font-semibold text-blue-900 mb-1">
          {legalCase.legalRelationship.legalRelationshipName}
        </p>
        <p className="text-sm text-blue-700 truncate">
          {
            legalCase.legalRelationship.legalRelationshipGroup
              .legalRelationshipGroupName
          }
        </p>
      </div>

      {/* Thông tin Mediator */}
      <div className="bg-green-50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-sm text-green-600 font-medium">Hòa giải viên</p>
        </div>
        {legalCase.mediator ? (
          <div className="space-y-1">
            <p className="text-base font-semibold text-green-900">
              {legalCase.mediator.fullName}
            </p>
            <p className="text-sm text-green-700">
              ID: {legalCase.mediator.officerId}
            </p>
            <p className="text-sm text-green-700">
              Email: {legalCase.mediator.email}
            </p>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-sm text-gray-600 italic">
              Không có hòa giải viên
            </p>
          </div>
        )}
      </div>

      {/* Ngày tháng */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Ngày thụ lý</p>
          <p className="text-base font-semibold text-gray-900">
            {formatDate(legalCase.acceptanceDate)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Ngày lưu trữ</p>
          <p className="text-base font-semibold text-blue-600">
            {legalCase.storageDate != null
              ? formatDate(legalCase.storageDate)
              : "Chưa lưu trữ"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalCaseCardSimple;
