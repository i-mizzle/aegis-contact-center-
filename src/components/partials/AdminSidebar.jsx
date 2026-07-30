import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CloseIcon from '../elements/icons/CloseIcon';

const AdminSidebar = ({ links, isCollapsed, mobileMenuActive, toggleMobileMenu }) => {
  const location = useLocation();
  const isMobileMenu = typeof mobileMenuActive === 'boolean' && typeof toggleMobileMenu === 'function';
  const isExpanded = isMobileMenu ? true : !isCollapsed;
  const showCollapsedDesktopIcon = !isMobileMenu && Boolean(isCollapsed);

  return (
    <div
      className={`w-full h-full ${isMobileMenu ? 'bg-black/30' : ''}`}
      onClick={() => {
        if (isMobileMenu && mobileMenuActive) {
          toggleMobileMenu();
        }
      }}
    >
      <div
        className={`h-full bg-stone-100 dark:bg-stone-950 transition-transform duration-300 ease-out ${isMobileMenu ? `w-75 max-w-[85vw] ${mobileMenuActive ? 'translate-x-0' : '-translate-x-full'}` : 'w-full'}`}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        
          <div className={`px-6 py-3 w-full border-b border-stone-300 dark:border-stone-900 lex items-center gap-x-4 ${isExpanded ? '' : 'justify-center px-2'}`}>
            {isMobileMenu && (
              <button
                type="button"
                onClick={toggleMobileMenu}
                className=""
                aria-label="Close mobile menu"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
            {/* <div className={isExpanded ? '' : 'w-full flex justify-center'}> */}
            
              {isExpanded && <h1 className='text-lg font-bold mb-0'>ISNAS Plus</h1>}
              {isExpanded && <p className='text-sm text-stone-600 dark:text-stone-300 font-space'>Administration</p>}
            {/* </div> */}
        </div>
        

        <div className={`${isExpanded ? 'mt-10 p-5' : 'mt-20 p-2'}`}>
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => {
                if (isMobileMenu && mobileMenuActive) {
                  toggleMobileMenu();
                }
              }}
              className={`flex items-center ${isExpanded ? '' : 'justify-center'} font-space p-4 rounded text-sm mb-2 gap-x-3 px-4 py-3 hover:bg-white/50 hover:text-stone-900 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition duration-200 ${location.pathname.includes(link.path) ? 'bg-white dark:bg-emerald/5 dark:text-white font-semibold' : 'text-stone-700 dark:text-stone-400'}`}
            >
              <link.icon className={`w-5 h-5 ${location.pathname.includes(link.path) ? 'text-emerald' : ''}`} />
              {isExpanded && link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar