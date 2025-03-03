import { CaretRight } from '@phosphor-icons/react';
import React from 'react';

const PageNotFound = () => {
    return (
        <div className="container text-center my-5 text-gray-700">
            <div className="row">
                <div className="col">
                    <h1 className="display-4">Page <span className="text-warning">not found</span></h1>
                    <p className="smaller my-5">
                        The page you are looking for could not be found.
                    </p>
                    <a href="/" className="btn btn-outline-secondary rounded-0">Go to Home <CaretRight /></a>
                </div>
            </div>
        </div>
    );
}

export default PageNotFound;