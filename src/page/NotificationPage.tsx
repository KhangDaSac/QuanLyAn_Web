import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationService } from '../services/NotificationService';
import type { NotificationResponse } from '../types/response/notification/NotificationResponse';
import { useToast } from '../component/basic-component/Toast';
import { NotificationType } from '../types/enum/NotificationType';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} phút trước`;
    }
    return `${hours} giờ trước`;
  } else if (days === 1) {
    return 'Hôm qua';
  } else if (days < 7) {
    return `${days} ngày trước`;
  }
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getNotificationTypeLabel = (type: string): string => {
  return (NotificationType as any)[type] || type;
};

const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case 'UPCOMING_DEADLINE':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        icon: 'text-orange-500',
        border: 'border-orange-200'
      };
    case 'OVERDUE_CASE':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: 'text-red-500',
        border: 'border-red-200'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        icon: 'text-gray-500',
        border: 'border-gray-200'
      };
  }
};

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  });

  const toast = useToast();

  useEffect(() => {
    loadNotifications();
  }, [pagination.page, pagination.size]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await NotificationService.getMyNotifications(
        pagination.page,
        pagination.size
      );

      if (response.success && response.data) {
        setNotifications(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalElements: response.data.totalElements || response.data.numberOfElement,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious
        });
      } else {
        toast.error('Lỗi', 'Không thể tải danh sách thông báo');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Lỗi', 'Không thể tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    navigate(`/notifications/${notificationId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header - giống Gmail */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Thông báo</h1>
              <div className="text-sm text-gray-600">
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                    {unreadCount} chưa đọc
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách thông báo */}
        <div className="bg-white">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="mt-4 text-lg text-gray-500">Không có thông báo nào</p>
              <p className="mt-2 text-sm text-gray-400">Các thông báo của bạn sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const colors = getNotificationTypeColor(notification.notificationType);
                return (
                  <div
                    key={notification.notificationId}
                    onClick={() => handleNotificationClick(notification.notificationId)}
                    className={`border-b border-gray-200 cursor-pointer transition-all hover:shadow-md ${
                      !notification.read ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center border-2 ${colors.border}`}>
                          <svg className={`w-6 h-6 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>

                        {/* Nội dung */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                                {getNotificationTypeLabel(notification.notificationType)}
                              </span>
                              {!notification.read && (
                                <span className="inline-flex items-center">
                                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                          
                          <h3 className={`text-base ${!notification.read ? 'font-bold' : 'font-semibold'} text-gray-900 mb-1`}>
                            {notification.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {notification.content}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && notifications.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị {notifications.length} / {pagination.totalElements} thông báo
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevious}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Trước
                  </button>
                  <span className="text-sm text-gray-600 px-3">
                    Trang {pagination.page + 1} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
