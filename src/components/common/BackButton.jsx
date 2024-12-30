import React from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ isStatic }) => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div
            className={` ${!isStatic ? 'position-fixed inx-10 fixed rounded-circle' : 'rounded-3 px-3 py-1'} flex-center bg-bodi text-gray-600 shadow clickDown ptr back-button`} title='Go back'
            onClick={handleGoBack}
        >
            <ArrowLeft size={30} className='p-1' />
            {isStatic &&
                <span className='ms-2 small'>Go back </span>
            }
        </div>
    );
};

export default BackButton;
