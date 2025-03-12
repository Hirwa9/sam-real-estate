import React from 'react';

const SearchSuggestions = ({ array = [], setData = () => { }, data = {}, callBack, className = '' }) => {

    return (
        <ul className={`list-unstyled search-results position-absolute inx-high w-100 p-3 bg-gray-300 rounded-4 shadow-sm small ${className} search-suggestions`} style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {array
                .map((item, index) => (
                    <li key={index} className="ptr"
                        onClick={() => {
                            setData({ ...data, searchValue: item });
                            callBack();
                        }}
                    >
                        {item}
                    </li>
                ))
            }
        </ul>
    )
}

export default SearchSuggestions;
