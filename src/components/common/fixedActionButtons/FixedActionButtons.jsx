import React, { useState, useEffect } from 'react';
import './fixedActionButtons.css';

const FixedActionButtons = ({ icons, className }) => {
    const [margin, setMargin] = useState('1rem');

    // Adjust margin based on number of icons
    useEffect(() => {
        const visibleLen = icons.filter(el => el.visible).length;
        if (visibleLen > 2) {
            setMargin("0.75rem");
        } else {
            setMargin("1rem");
        }
    }, [icons]);

    return (
        <div className={`rounded-2 ${className !== undefined ? className : ''} fixed-action-buttons`}>
            {icons
                .map((icon, index) => {
                    const visibilityClass = icon.visible ? 'working' : '';
                    return (
                        <div
                            key={index}
                            style={{ marginTop: icon.visible ? margin : '' }}
                            title={icon.title ? icon.title : undefined}
                            className={`bounceClick collapsible-grid-y ${visibilityClass}`}
                        >
                            <div className='collapsing-content'>{icon.icon}</div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default FixedActionButtons;
