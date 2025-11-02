import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NotificationService } from '../services/NotificationService';
import type { NotificationResponse } from '../types/response/notification/NotificationResponse';
import { useToast } from '../component/basic-component/Toast';
import { NotificationType } from '../types/enum/NotificationType';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const NotificationDetailPage = () => {
  const { notificationId } = useParams<{ notificationId: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (notificationId) {
      loadNotification();
    }
  }, [notificationId]);

  const loadNotification = async () => {
    if (!notificationId) return;
    
    setLoading(true);
    try {
      const response = await NotificationService.getNotificationById(notificationId);

      if (response.success && response.data) {
        setNotification(response.data);
      } else {
        toast.error('Lỗi', 'Không thể tải chi tiết thông báo');
        navigate('/notifications');
      }
    } catch (error) {
      console.error('Error loading notification detail:', error);
      toast.error('Lỗi', 'Không thể tải chi tiết thông báo');
      navigate('/notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/notifications');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Không tìm thấy thông báo</p>
          <button
            onClick={handleBack}
            className="mt-4 text-red-600 hover:text-red-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const colors = getNotificationTypeColor(notification.notificationType);

  return (
    <div className="">
      <div className=" bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="px-6 py-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Quay lại danh sách</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center border-2 ${colors.border}`}>
                <svg className={`w-6 h-6 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {getNotificationTypeLabel(notification.notificationType)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className="px-6 py-8">
          {/* Tiêu đề */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {notification.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDate(notification.createdAt)}</span>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {notification.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailPage;
