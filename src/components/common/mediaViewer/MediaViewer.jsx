import React, { useCallback, useEffect, useRef, useState } from 'react'
import './mediaViewer.css'
import { ArrowsInSimple, ArrowsOutSimple, CaretLeft, CaretRight } from '@phosphor-icons/react'

const MediaViewer = ({ media, onClose, goToUrl, toggleFitness }) => {

    /**
     * Scrolling images
     */
    const [coverView, setCoverView] = useState(false);
    const containerRef = useRef(null);

    const scrollRight = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += containerRef.current.offsetWidth;
        }
    }, []);

    const scrollLeft = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= containerRef.current.offsetWidth;
        }
    }, []);

    // Handle key press functions
    useEffect(() => {
        const handleMediaChange = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Escape') {
                // Media change
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    scrollLeft();
                }
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    scrollRight();
                }
                if (e.key === 'Escape') {
                    onClose();
                }
            }
        };

        // Attach key press event listener
        document.addEventListener('keyup', handleMediaChange);
        return () => {
            document.removeEventListener('keyup', handleMediaChange); // Clean up
        };
    }, [scrollLeft, scrollRight, onClose]);

    // Scroll to the goToUrl element
    const matchElement = media.find(item => item.url === goToUrl);
    const goToIndex = media.indexOf(matchElement);
    setTimeout(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.offsetWidth * goToIndex;
        }
    });

    return (
        <>
            <div className="position-fixed fixed-top inset-0 bg-light mediaViewerWrapper">
                {/* Media */}
                <div ref={containerRef} className={`bg-dark dim-100 d-grid auto-flow-col ${coverView ? 'cover-elements' : ''} media-container`}>
                    {media.map((item, index) => (
                        <img key={index} src={item.url} alt="An_image" className='px-1 media-box' />
                    ))}
                </div>

                {/* Sliders */}
                <div className="position-absolute inset-0 ptr-none sliders">
                    <CaretLeft
                        className="position-absolute flex-center px-2 ptr-all rounded bounceClick slider slider-left"
                        onClick={scrollLeft} />
                    <CaretRight
                        className="position-absolute flex-center px-2 ptr-all rounded bounceClick slider slider-right"
                        onClick={scrollRight} />
                </div>

                {/* Togglers */}
                {/* Closer */}
                <div className='flex-center action-toggler mediaViewer_closer' onClick={onClose}>
                    <button className='w-1_5rem border-0 clickDown closerX closerX-black1'></button>
                </div>
                {/* Object fitness toggler */}
                {toggleFitness &&
                    <div className='flex-center action-toggler mediaViewer_objectFitToggler'>
                        {coverView ?
                            <ArrowsInSimple size={30} className='w-1_5rem border-0 clickDown' onClick={() => setCoverView(false)} />
                            : <ArrowsOutSimple size={30} className='w-1_5rem border-0 clickDown' onClick={() => setCoverView(true)} />
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default MediaViewer;
