import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom';

const PaymentsAssistancePage = () => {
    const childPages = [
        {
            label: 'Programmes',
            path: '/admin/payments-assistance/programmes',
        },
        {
            label: 'Budgets',
            path: '/admin/payments-assistance/budgets',
        },
        {
            label: 'Recipients',
            path: '/admin/payments-assistance/recipients',
        },
        {
            label: 'Payments',
            path: '/admin/payments-assistance/payments',
        },
    ];

    const location = useLocation();
    return (
        <section className="w-full space-y-5">
            <div className="">
                <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Payments & Assistance</p>
                <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">Budgets & Disbursements Suite</h1>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                    Centralized platform for managing assistance budgets, beneficiary verification, payment disbursements, and reconciliation workflows.
                </p>
            </div>

            <div className="rounded-lg border p-3 dark:border-stone-800">
                <div className="no-scrollbar flex gap-2 overflow-x-auto">
                {childPages.map((item) => {
                    const isActive = location.pathname.includes(item.path);
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
            <div className="w-full">
                <Outlet />
            </div>
        </section>
    )
}

export default PaymentsAssistancePage