import React, { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';

/**
 * Hook that alerts clicks outside of the passed ref
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useOutsideAlerter(ref, closeFunction) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeFunction();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeFunction, ref]);
}

const SelectField = ({
  disabled,
  selectOptions,
  inputLabel,
  titleField,
  hasError,
  returnFieldValue,
  preSelectedIndex,
  preSelected,
  preSelectedLabel,
  requiredField
}) => {
  const [activeValue, setActiveValue] = useState('');
  const [visibleOptions] = useState(selectOptions);
  // const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    const preSelect = () => {
      if (preSelected !== undefined) {
        const selectedOption = selectOptions.find(
          (option) => option[preSelectedLabel] === preSelected
        );
        if (selectedOption) {
          setActiveValue(selectedOption[titleField]);
        }
      } else if (preSelectedIndex !== undefined && selectOptions[preSelectedIndex]) {
        setActiveValue(selectOptions[preSelectedIndex][titleField]);
      }
    };
    preSelect();
  }, [preSelected, preSelectedLabel, selectOptions, titleField, preSelectedIndex]);

  // const closeOptions = () => {
  //   setOptionsOpen(false);
  // };

  const changeActiveValue = (valueIndex) => {
    if (valueIndex !== '') {
      setActiveValue(selectOptions[valueIndex][titleField] || selectOptions[valueIndex]);
      returnFieldValue(selectOptions[valueIndex]);
    }
    // closeOptions();
  };

  const wrapperRef = useRef(null);
  // useOutsideAlerter(wrapperRef, closeOptions);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div>
        <label 
          className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-1 block duration-200  
          ${hasError ? 'text-red-400' : 'text-gray-500 dark:text-gray-300'}`}
        >
            {inputLabel} {requiredField && requiredField === true && <span className='text-red-400'>*</span>}
        </label>

        <select
          className={`rounded py-3 px-4 text-sm block w-full focus:border-gray-800 focus:outline-none hover:border-gray-200 dark:hover:border-stone-900 border bg-black/10 dark:bg-black/20 transition duration-200 focus:bg-white dark:focus:bg-stone-950 dark:focus:border-stone-700 font-outfit placeholder:font-outfit  ${hasError ? 'border-red-400' : 'border-transparent'}`}
          onChange={(e) => { changeActiveValue(e.target.value); }}
          value={selectOptions.findIndex(option => option[titleField] === activeValue)}
          disabled={disabled}
        >
          <option value="">
            -- select an option --
          </option>
          {visibleOptions?.map((option, optionIndex) => (
            <option value={optionIndex} key={optionIndex}>
              {option[titleField]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// SelectField.propTypes = {
//   selectOptions: PropTypes.array.isRequired,
//   inputLabel: PropTypes.string.isRequired,
//   titleField: PropTypes.string.isRequired,
//   displayImage: PropTypes.bool.isRequired,
//   imageField: PropTypes.string,
//   fieldId: PropTypes.string.isRequired,
//   hasError: PropTypes.bool,
//   returnFieldValue: PropTypes.func.isRequired,
//   preSelectedIndex: PropTypes.any,
//   preSelected: PropTypes.any,
//   preSelectedLabel: PropTypes.string,
//   requiredField: PropTypes.bool,
//   disabled: PropTypes.bool,
// };

export default SelectField;
