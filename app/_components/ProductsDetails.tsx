import React from 'react';
import RecentOrders from './RecentOrders';
import SalesPerformance from './SalesPerformance';
import type { Notification } from '../_lib/type';
import Link from 'next/link';

interface ProductsDetailsProps {
  notifications: Notification[];
  loading: boolean;
}

function ProductsDetails({ notifications, loading }: ProductsDetailsProps) {
  return (
    <div className='w-full flex flex-col gap-2.5'>
      <RecentOrders />
      <SalesPerformance />

      <div className="bg-white rounded-[6px] px-4 py-3 mt-5">
        <h1 className="text-black font-semibold text-sm mb-3">Latest Notifications</h1>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : (
          <>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-xs">No notifications yet.</p>
            ) : (
              notifications
                .slice(0, 3) // latest 3 notifications
                .map((notif) => (
                  <div
                    key={notif._id}
                    className="border-b border-gray-200 py-2 flex flex-col"
                  >
                    <p className="text-sm font-semibold text-black">{notif.title}</p>
                    <p className="text-xs text-gray-500">{notif.content}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notif.created_at).toLocaleDateString()}{" "}
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
            )}
          </>
        )}
        <Link href="notifications" className='text-xs text-blue-500 underline'>View All</Link>
      </div>
      
    </div>
  );
}

export default ProductsDetails;
