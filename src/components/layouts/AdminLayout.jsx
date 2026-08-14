
import { useEffect, useState } from 'react'
import AdminHeader from '../partials/AdminHeader';
import AdminSidebar from '../partials/AdminSidebar';
import DashboardIcon from '../elements/icons/DashboardIcon';
import BriefcaseIcon from '../elements/icons/BriefcaseIcon';
import TransactionsIcon from '../elements/icons/TransactionsIcon';
import SquaresIcon from '../elements/icons/SquaresIcon';
import ListIcon from '../elements/icons/ListIcon';
import UsersIcon from '../elements/icons/UsersIcon';
import ChevronIcon from '../elements/icons/ChevronIcon';
import HeadphoneIcon from '../elements/icons/HeadphoneIcon';
import ExclamationTriangleIcon from '../elements/icons/ExclamationTriangleIcon';
import SpeakerWaveIcon from '../elements/icons/SpeakerWaveIcon';
import PlugIcon from '../elements/icons/PlugIcon';
import OpenCubeIcon from '../elements/icons/OpenCubeIcon';

const SIDEBAR_COLLAPSE_BREAKPOINT = 1264;

const AdminLayout = ({ children }) => {
  const SIDEBAR_STORAGE_KEY = 'admin_sidebar_collapsed';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (window.innerWidth < SIDEBAR_COLLAPSE_BREAKPOINT) {
      return true;
    }

    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return savedState === 'true';
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    let wasBelowBreakpoint = window.innerWidth < SIDEBAR_COLLAPSE_BREAKPOINT;

    const handleResize = () => {
      const isBelowBreakpoint = window.innerWidth < SIDEBAR_COLLAPSE_BREAKPOINT;

      if (isBelowBreakpoint && !wasBelowBreakpoint) {
        setIsSidebarCollapsed(true);
      }

      wasBelowBreakpoint = isBelowBreakpoint;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sidebarLinks = [
    { 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      icon: DashboardIcon,
      subLinks: [
        {
          label: 'Command Dashboard',
          path: '/admin/dashboard/command',
        },
        {
          label: 'Call Center Dashboard',
          path: '/admin/dashboard/call-center',
        },
        {
          label: 'Dispatch & Operations Dashboard',
          path: '/admin/dashboard/dispatch-operations',
        },
        {
          label: 'Responder Dashboard',
          path: '/admin/dashboard/responder',
        },
        {
          label: 'Analytics & Intelligence',
          path: '/admin/dashboard/analytics-intelligence',
        },
        {
          label: 'Performance & Reporting',
          path: '/admin/dashboard/performance-reporting', 
        },
        {
          label: 'Public Warning & Notifications',
          path: '/admin/dashboard/public-warning-notifications',
        }
      ] 
    },
    {
      label: 'Resources & Assets',
      path: '/admin/resources-assets',
      icon: SquaresIcon
    },
    {
      label: 'AEGIS Assets',
      path: '/admin/aegis-assets',
      icon: OpenCubeIcon
    },
    { 
      label: 'Incidents', 
      path: '/admin/incidents',
      icon: ExclamationTriangleIcon 
    },
    {
      label: 'Public Warnings',
      path: '/admin/public-warnings',
      icon: SpeakerWaveIcon
    },
    { 
      label: 'Payments & Assistance', 
      path: '/admin/payments-assistance',
      icon: TransactionsIcon 
    },
    { 
      label: 'Integrators', 
      path: '/admin/integrators',
      icon: PlugIcon 
    },
    // {
    //   label: 'Users',
    //   path: '/admin/users',
    //   icon: UsersIcon
    // },
    // {
    //   label: 'Logs',
    //   path: '/admin/logs',
    //   icon: ListIcon
    // },
    // {
    //   label: 'Support',
    //   path: '/admin/support',
    //   icon: HeadphoneIcon
    // },
  ];

  const [mobileMenuActive, setMobileMenuActive] = useState(false)

  return (
    <div className="w-full relative min-h-screen bg-stone-50 dark:bg-stone-950">
      <div
        className={`fixed hidden md:block inset-y-0 left-0 border-r border-stone-200 dark:border-stone-900 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-75'}`}
      >
        <AdminSidebar links={sidebarLinks} isCollapsed={isSidebarCollapsed} />
      </div>

      <div
        className={`fixed inset-0 z-999 md:hidden transition-opacity duration-300 ${mobileMenuActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <AdminSidebar
          links={sidebarLinks}
          isCollapsed={false}
          mobileMenuActive={mobileMenuActive}
          toggleMobileMenu={() => {
            setMobileMenuActive(false);
          }}
        />
      </div>

      <div
        className={`min-h-screen relative w-full transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20 md:w-[calc(100%-5rem)]' : 'md:ml-75 md:w-[calc(100%-18.75rem)]'}`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className={`fixed hidden md:block top-5.5 p-2 cursor-pointer rounded bg-white shadow-lg shadow-black/10 dark:shadow-black/20 dark:bg-stone-800 text-stone-700 dark:text-stone-300 z-990 transition duration-200 ${isSidebarCollapsed ? 'left-16' : 'left-71'}`}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronIcon className={`w-4 h-4 transition transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
        <AdminHeader toggleMobileMenu={()=>{setMobileMenuActive(!mobileMenuActive)}} />
        <main className='px-8 py-4'>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout