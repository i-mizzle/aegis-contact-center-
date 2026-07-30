import React from 'react'
import CheckIcon from '../icons/CheckIcon'
import PropTypes from 'prop-types';

const Checkbox = ({CheckboxLabel, checkboxToggleFunction, isChecked, hasError}) => {
  return (
    <div className='w-full flex items-start gap-x-2'>
      <div className='w-6.25 mt-0.5'>

        <button 
            className={`flex items-center justify-center w-5 h-5 border rounded transition duration-200 text-white 
            ${isChecked ? 'bg-stone-700 border-stone-700 dark:bg-stone-200 dark:border-stone-200' : 'bg-transparent border-stone-500'}
            ${hasError ? 'border-red-600' : 'border-stone-500'}`
          } 
          onClick={checkboxToggleFunction}
        >
            {isChecked && <CheckIcon className="w-5 h-5 text-white dark:text-stone-700" />}
        </button>
      </div>
      <p className={`text-sm mt-0.5 ${hasError ? 'text-red-600 dark:text-red-400' : 'text-stone-700 dark:text-stone-200 '}`}>
        {CheckboxLabel}
      </p>
    </div>
  )
}

Checkbox.propTypes = {
  CheckboxLabel: PropTypes.any.isRequired,
  hasError: PropTypes.bool,
  isChecked: PropTypes.bool,
  checkboxToggleFunction: PropTypes.func.isRequired
};

export default Checkbox