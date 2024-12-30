import React from "react";

const Heading = ({ title, subtitle, hType, className, titleClassName, subtitleClassName }) => {
    let header;
    switch (hType) {
        case 'h1':
            header = <h1 className={`col-10 col-md-12 m-auto mb-3 display-2 ${titleClassName} text-balance`}>{title}</h1>
            break;
        case 'h2':
            header = <h2 className={`col-10 col-md-12 m-auto mb-3 display-6 ${titleClassName} text-balance`}>{title}</h2>
            break;
        case 'h3':
            header = <h3 className={`col-10 col-md-12 m-auto mb-3 display-6 ${titleClassName} text-balance`}>{title}</h3>
            break;
        case 'h4':
            header = <h4 className={`col-10 col-md-12 m-auto mb-3 display-6 ${titleClassName} text-balance`}>{title}</h4>
            break;
        case 'h5':
            header = <h5 className={`col-10 col-md-12 m-auto mb-3 display-6 ${titleClassName} text-balance`}>{title}</h5>
            break;
        case 'h6':
            header = <h6 className={`col-10 col-md-12 m-auto mb-3 display-6 ${titleClassName} text-balance`}>{title}</h6>
            break;
        default:
            header = <h1 className={`col-10 col-md-12 m-auto mb-3 display-6 ${titleClassName} text-balance`}>{title}</h1>
            break;
    }

    return (
        <>
            <div className={`text-center col-md-9 m-auto my-5 ${className !== undefined ? className : ''} heading`}>
                {header}
                <p className={`${subtitleClassName}`}>
                    {subtitle}
                </p>
            </div>
        </>
    );
}

export default Heading;