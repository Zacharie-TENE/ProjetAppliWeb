'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import   NotificationService from '@/services/notification-service';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await NotificationService.getAllNotifications();
      const data = response.data || response;
      setNotifications(data);
      setUnreadCount(data.filter(notification => !notification.isRead).length);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Update on the server
      await NotificationService.markAsRead(notificationId);
      
      // Update locally
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId ? { ...notification, isRead: true, readAt: new Date() } : notification
      ));

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Update on the server 
      await NotificationService.markAllAsRead();
      
      // Update locally
      setNotifications(prev => prev.map(notification => ({ 
        ...notification, 
        isRead: true,
        readAt: notification.readAt || new Date()
      })));
      
      setUnreadCount(0);
    } catch (err) {
    }
  }, []);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Remove a notification
  const removeNotification = useCallback(async (notificationId) => {
    try {
      // Delete on the server
      await NotificationService.deleteNotification(notificationId);
      
      // Update locally
      setNotifications(prev => {
        const notificationToRemove = prev.find(n => n.id === notificationId);
        const newNotifications = prev.filter(n => n.id !== notificationId);
        
        if (notificationToRemove && !notificationToRemove.isRead) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        
        return newNotifications;
      });
    } catch (err) {
    }
  }, []);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling or websocket connection for real-time notifications
    const intervalId = setInterval(fetchNotifications, 60000); // Poll every minute
    
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  // Setup WebSocket connection for real-time notifications
  useEffect(() => {
    // Get user from localStorage
    const userStr = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user?.id) {
      // Subscribe to notifications
      const socket = NotificationService.subscribeToNotifications(
        user.id,
        (newNotification) => {
          addNotification(newNotification);
        }
      );
      
      // Clean up on unmount
      return () => {
        if (socket) {
          NotificationService.unsubscribeFromNotifications(socket);
        }
      };
    }
  }, [addNotification]);

  // Function to show a notification to the user (toast)
  const showNotification = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    toast[type](<div>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>, {
      position: "top-right",
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    showNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};