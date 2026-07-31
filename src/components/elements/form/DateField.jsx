import React, { useState } from 'react'

const DateField = ({
    requiredField,
    inputLabel, 
    fieldId, 
    hasError, 
    returnFieldValue, 
    preloadValue, 
    disabled, 
}) => {
    const [ fieldValue, setFieldValue ] = useState(preloadValue)


    const setValue = (value) => {
        setFieldValue(value)
        returnFieldValue(value)
    }

    return (
        <div>

            <div className='relative flex items-center justify-between mb-1'>
                <label 
                    className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition block duration-200  
                    ${hasError ? 'text-red-400' : 'text-gray-500 dark:text-gray-300'}`}
                >
                    {inputLabel} {requiredField && requiredField === true && <span className='text-red-400'>*</span>}
                </label>
                {hasError && <span className='text-red-400 text-xs'>{hasError}</span>}
            </div>
            <input 
                id={fieldId} 
                type="date" 
                className={`rounded py-3 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-stone-900 border bg-black/10 dark:bg-black/20 transition duration-200 focus:bg-white dark:focus:bg-stone-950 dark:focus:border-stone-700 font-outfit placeholder:font-outfit  ${hasError ? 'border-red-400' : 'border-transparent'}`}
                onChange={(e)=>{setValue(e.target.value)}}
                value={fieldValue}
                disabled={disabled}
            /> 
        </div>
    )
}

export default DateField