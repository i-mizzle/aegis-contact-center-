import React from 'react'
import CloseIcon from '../elements/icons/CloseIcon'

const SlideOutModal = ({children, isOpen, closeFunction, title, subTitle}) => {
  if (!isOpen) {
    return null
  }

  return (
      <>
        <div
          className="fixed left-0 top-0 h-screen w-full border-black bg-[#00000084]"
          style={{ zIndex: 995 }}
          onClick={closeFunction}
        />
        <div className="fixed right-0 top-0 h-screen w-full overflow-y-scroll scrollbar-hidden border-black bg-white shadow-lg shadow-black/10 transition-all duration-200 dark:bg-stone-950 md:w-100 lg:w-125 xl:w-137.5 translate-x-0" style={{zIndex: 998}}>
            <button className='absolute top-3 right-3 cursor-pointer text-black dark:text-white p-2 rounded hover:text-gray-600 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-900' onClick={()=>{closeFunction()}} style={{zIndex: '997'}}>
                <CloseIcon className="w-5 h-5 text-black dark:text-gray-300" />
            </button>

            <div className='py-3 w-full border-b border-gray-200 dark:border-stone-900 px-8 pt-4'>
                <h3 className='text-md font-[550]'>{title}</h3>
                <p className='text-sm'>{subTitle}</p>
            </div>

            <div className='px-8'>
              {children}
            </div>

        </div>
      </>
  )
}

export default SlideOutModal