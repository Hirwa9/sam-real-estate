import React, { useRef, useState, useEffect } from 'react';
import './propertyMediaContainer.css'
import MediaViewer from '../common/mediaViewer/MediaViewer';
import { ArrowSquareOut, CaretLeft, CaretRight, Image, MapTrifold, XCircle } from '@phosphor-icons/react';
/* globals $ */

const PropertyMediaContainer = ({ className, inlineStyles, primaryImage, media, video, map }) => {
    const availableMedia = JSON.parse(media);
    const images = availableMedia.images.slice(1);
    const totalImage = images.length;
    // If map exists, show only 3 images in first grid, otherwise 4
    let nextImageIndex = map !== null ? 3 : 4;

    /**
     * Scrolling images
     */
    const containerRef = useRef(null);

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += containerRef.current.offsetWidth;
        }
    };

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= containerRef.current.offsetWidth;
        }
    };

    /**
     * Toggling property map
     */

    const mapRef = useRef();

    // Extract the map's src attribute
    const extractSrcFromIframe = (iframeHtml) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = iframeHtml;
        const iframe = tempDiv.querySelector('iframe');
        return iframe ? iframe.src : null;
    }
    const mapUrl = extractSrcFromIframe(map);

    // Open the extracted URL in a new tab
    const openMapInNewTab = () => {
        if (mapUrl) {
            window.open(mapUrl, '_blank');
        } else {
            console.error('Failed to extract map URL');
        }
    }
    const [showPropertyLocationMap, setShowPropertyLocationMap] = useState(false)
    const hidePropertyMap = () => {
        mapRef.current.classList.add('flyOutB');
        setTimeout(() => {
            setShowPropertyLocationMap(false);
            mapRef.current.classList.add('flyOutB');
        }, 400);
    }

    /**
     * Toggling property images
     */

    const imagesRef = useRef();
    const [showPropertyImages, setShowPropertyImages] = useState(false);
    const hidePropertyImages = () => {
        imagesRef.current.classList.add('flyOutB');
        setTimeout(() => {
            setShowPropertyImages(false);
            imagesRef.current.classList.add('flyOutB');
        }, 400);
    }

    // Opening images viewer 
    const [openImageViewer, setOpenImageViewer] = useState(false);
    const [scrollTo, setScrollTo] = useState('');

    useEffect(() => {
        // Toogle the header on sm devices when property map opens/closes
        (showPropertyLocationMap || showPropertyImages) ?
            $('header').addClass('dom-scrolling-down')
            : $('header').removeClass('dom-scrolling-down');
    }, [showPropertyLocationMap, showPropertyImages]);


    return (
        <>
            {/* Property images presentation */}
            <div className={`position-relative container-fluid ${className !== undefined ? className : ''}`} style={inlineStyles} id='imageSlider'>
                {/* Slides */}
                <div className="position-absolute inset-0 inx-1 ptr-none sliders">
                    <CaretLeft weight='bold'
                        className="position-absolute flex-center px-2 ptr-all rounded bounceClick slider slider-left"
                        onClick={scrollLeft} />
                    <CaretRight weight='bold'
                        className="fa fa-angle-right position-absolute flex-center px-2 ptr-all rounded bounceClick slider slider-right"
                        onClick={scrollRight} />
                </div>
                {/* Scrollable Divs */}
                <div className="h-100 w-100 d-grid scroll-smooth slides-container images-container" ref={containerRef}>
                    {/* Render images */}
                    <div className="imgages-grid imgages-grid-main">
                        <img src={primaryImage} alt="" className="main-image" onClick={() => { setScrollTo(images[0].url); setOpenImageViewer(true); }} />
                        {map !== null ? (
                            <>
                                <div className='position-relative' onClick={() => { $('#showPropertyMap').trigger('click') }}>
                                    <img src="/images/map_illustration_image.jpg" alt="Map" className="ptr" title="Open location map" />
                                    <button className="btn btn-sm btn-primaryColor px-3 border-warning border-2 position-absolute inset-0 m-auto w-fit h-fit rounded-pill" id='showPropertyMap' onClick={() => setShowPropertyLocationMap(true)}>Show on map</button>
                                </div>
                                <img src={images[0]?.url} alt=""
                                    onClick={() => { setScrollTo(images[0]?.url); setOpenImageViewer(true); }} />
                                <img src={images[1]?.url} alt=""
                                    onClick={() => { setScrollTo(images[1]?.url); setOpenImageViewer(true); }} />
                                <img src={images[2]?.url} alt=""
                                    onClick={() => { setScrollTo(images[2]?.url); setOpenImageViewer(true); }} />
                            </>
                        ) : (
                            <>
                                <img src={images[0]?.url} alt=""
                                    onClick={() => { setScrollTo(images[0]?.url); setOpenImageViewer(true); }} />
                                <img src={images[1]?.url} alt=""
                                    onClick={() => { setScrollTo(images[1]?.url); setOpenImageViewer(true); }} />
                                <img src={images[2]?.url} alt=""
                                    onClick={() => { setScrollTo(images[2]?.url); setOpenImageViewer(true); }} />
                                <img src={images[3]?.url} alt=""
                                    onClick={() => { setScrollTo(images[3]?.url); setOpenImageViewer(true); }} />
                            </>
                        )}
                    </div>
                    {/* Check if we need to create the second grid */}
                    {totalImage > nextImageIndex && (
                        <div className="imgages-grid">
                            {images.slice(nextImageIndex, nextImageIndex + 8).map((image, index) => (
                                <img key={index} src={image.url} alt={`Image_${nextImageIndex + index}`}
                                    onClick={() => { setScrollTo(image.url); setOpenImageViewer(true); }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Limit to at most two image grids */}
                    {totalImage > nextImageIndex + 8 && (
                        <div className="imgages-grid">
                            {images.slice(nextImageIndex + 8, nextImageIndex + 16).map((image, index) => (
                                <img key={index} src={image.url} alt={`Image_${nextImageIndex + 8 + index}`}
                                    onClick={() => { setScrollTo(image.url); setOpenImageViewer(true); }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {/* Property details */}
                <div className="postion-absolute bottom-0 left-0 right-0 mx-auto d-flex flex-wrap column-gap-3 row-gap-1 bg-light p-2 rounded w-fit overflow-auto shadow" style={{ translate: "0 -50%", maxWidth: "95vw" }}>
                    <span className='btn btn-sm rad-inherit text-nowrap px-3 border' onClick={() => setShowPropertyImages(true)} >{totalImage + 1} photos</span>
                    {map !== null &&
                        <span className='btn btn-sm flex-align-center rad-inherit text-nowrap px-3 border' onClick={() => setShowPropertyLocationMap(true)} title='Open location map'>
                            <MapTrifold size={18} weight='fill' className='text-black2 opacity-75 me-1' /> Property map
                        </span>
                    }
                    {video !== null &&
                        <span className='btn btn-sm rad-inherit text-nowrap px-3 border'>1 video</span>
                    }
                </div>
            </div>

            {/* Property map */}
            {showPropertyLocationMap &&
                <div className="position-fixed inset-0 inx-high px-lg-5 bg-black3 blur-bg-2px user-select-none" id="porpertyMap">
                    <div ref={mapRef}
                        className="position-relative h-100 content-container">
                        <div className="d-flex align-items-center gap-2 p-2 text-light">
                            <div className="flex-align-center">
                                <ArrowSquareOut className="me-2 p-2 border border-2 border-light rounded-circle ptr clickDown"
                                    size={36}
                                    weight="bold"
                                    title="Open in Google maps"
                                    onClick={openMapInNewTab}
                                />
                                <small className='fw-light'>Open in Google maps</small>
                            </div>
                            <XCircle className="ms-auto ptr clickDown"
                                size={45}
                                weight="fill"
                                onClick={hidePropertyMap}
                            />
                        </div>
                        {/* Render the iframe as HTML */}
                        <div className="dim-100 bg-white1 overflow-hidden" style={{ borderRadius: "1.5rem 1.5rem 0 0" }}
                            dangerouslySetInnerHTML={{ __html: map }}
                        />
                    </div>
                </div>
            }

            {/* Property images */}
            {showPropertyImages &&
                <div className="position-fixed inset-0 inx-high px-lg-5 bg-black3 blur-bg-2px user-select-none" id="porpertyImages">
                    <div ref={imagesRef}
                        className="position-relative h-100 rounded-top content-container">
                        <div className="d-flex align-items-center gap-2 p-2 text-light">
                            <div className="flex-align-center">
                                <Image className="me-2 p-2 border border-2 border-light rounded-circle"
                                    size={36}
                                    weight="bold"
                                />
                                <span>Property gallery</span>
                            </div>
                            <XCircle className="ms-auto ptr clickDown"
                                size={45}
                                weight="fill"
                                onClick={hidePropertyImages}
                            />
                        </div>
                        {/* Render property images */}
                        <div className="h-100 bg-light overflow-auto">
                            <div className="row w-fit m-0 px-sm-1 py-1 py-sm-2">
                                {
                                    images.map((image, index) => (
                                        <img key={index} src={image.url} alt={`Property_image_${index + 1}`} className='col-sm-6 col-md-4 col-xl-3 px-1 mb-1 mb-sm-2 ptr clickDown' onClick={() => { setScrollTo(image.url); setOpenImageViewer(true); setShowPropertyImages(false) }} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Property images fullscreen viewer */}
            {openImageViewer &&
                <MediaViewer media={images} goToUrl={scrollTo} onClose={() => setOpenImageViewer(false)} />
            }
        </>
    );
};

export default PropertyMediaContainer;
