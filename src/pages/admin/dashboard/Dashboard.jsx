import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const Dashboard = () => {
  const location = useLocation();

  const dashboardLinks = [
    {
      label: 'Command',
      path: '/admin/dashboard/command',
    },
    {
      label: 'Call Center',
      path: '/admin/dashboard/call-center',
    },
    {
      label: 'Dispatch Ops',
      path: '/admin/dashboard/dispatch-operations',
    },
    {
      label: 'Responder',
      path: '/admin/dashboard/responder',
    },
    {
      label: 'Analytics',
      path: '/admin/dashboard/analytics-intelligence',
    },
    {
      label: 'Performance',
      path: '/admin/dashboard/performance-reporting',
    },
    {
      label: 'Public Warning',
      path: '/admin/dashboard/public-warning-notifications',
    },
        {
      label: 'Payments & Assistance',
      path: '/admin/dashboard/payments-assistance',
    },
  ];

  return (
    <section className="w-full space-y-5">
      <div className="">
        <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Emergency Command Platform</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">Operations Dashboard Suite</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          National response intelligence for command, call center, dispatch, responder, analytics, performance, and public warning operations.
        </p>
      </div>

      <div className="rounded-lg border p-3 dark:border-stone-800">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {dashboardLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald text-stone-800 dark:bg-light-green dark:text-stone-900!'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-800 dark:hover:bg-stone-700/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <Outlet />
    </section>
  )
}

export default Dashboard