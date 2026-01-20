"use client";
import React from 'react';
import RecentOrders from './RecentOrders';
import SalesPerformance from './SalesPerformance';
import type { Notification } from '../_lib/type';
import LatestNotifications from './LatestNotifications';

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
          <LatestNotifications
            notifications={notifications}
            loading={loading}
            variant="dashboard"
            limit={3}
            showViewAllLink
            viewAllHref="/notifications"
          />
        ) : (
          <>
            <LatestNotifications
              notifications={notifications}
              loading={loading}
              variant="dashboard"
              limit={3}
              showViewAllLink
              viewAllHref="/notifications"
            />
          </>
        )}
      </div>
      
    </div>
  );
}

export default ProductsDetails;
