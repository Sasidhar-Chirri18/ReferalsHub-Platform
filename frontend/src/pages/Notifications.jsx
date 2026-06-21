import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Eye } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 min-h-[80vh]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <Bell className="h-8 w-8 text-primary-400" />
            <span>Notifications</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Keep track of your referral updates</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-xs px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors duration-250 font-semibold"
          >
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl">
          <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">All Caught Up!</h3>
          <p className="text-slate-400 text-sm mt-1">No notifications received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <GlassCard
              key={notif.id}
              className={`flex items-start justify-between gap-4 py-4 px-6 border-l-4 transition-all duration-300 ${
                notif.isRead
                  ? 'border-transparent opacity-60 bg-slate-950/20'
                  : 'border-primary-500 bg-primary-500/5'
              }`}
            >
              <div className="space-y-1">
                <p className="text-slate-200 text-sm leading-relaxed">{notif.message}</p>
                <p className="text-[10px] text-slate-500">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  title="Mark as read"
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
