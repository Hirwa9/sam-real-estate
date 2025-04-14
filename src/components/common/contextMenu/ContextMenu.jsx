import React, { useEffect, useState, useRef } from 'react';
import './contextMenu.css';

const ContextMenu = ({ show = false, options = [], position = { left: 15, top: 15 } }) => {

    const menuRef = useRef(null);

    const [showOptions, setShowOptions] = useState(false);

    // Toggle visibility 
    useEffect(() => {
        if (show) {
            setShowOptions(true);
        } else {
            setShowOptions(false);
        }
    }, [show]);

    // Hide when not focused
    useEffect(() => {
        const handleInactive = (e) => {
            // Check if click target is outside the menu
            if (e.key === "Escape") {
                if (menuRef.current && !menuRef.current.contains(e.target)) {
                    setShowOptions(false);
                }
            }
        };

        // Add event listener to detect clicks outside
        document.addEventListener('keydown', handleInactive);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('keydown', handleInactive);
        };
    }, []);

    return (
        <>
            {showOptions && (
                <div
                    ref={menuRef} // Attach ref to the menu div
                    className={`rounded-3 cont-menu ${showOptions ? 'working' : ''}`}
                    style={{ left: `${position.left}px`, top: `${position.top}px`, }}
                >
                    <ul>
                        {
                            options.map((item, index) => (
                                <li key={index}
                                    className={`d-flex align-items-center gap-2 ${item.textColor ? `text-${item.textColor}` : 'text-gray-800'}`}
                                    onClick={() => { item.action(); setShowOptions(false); }}
                                >
                                    {item.icon && item.icon} {item.title}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
        </>
    );
};

export default ContextMenu;