import React from 'react'

const PlugIcon = ({className}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="800"
            fill="none"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 7h12v5a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6zM15 2v5M12 18v4M9 2v5"
            ></path>
        </svg>
    )
}

export default PlugIcon