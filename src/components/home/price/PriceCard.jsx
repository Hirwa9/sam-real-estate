import React from 'react';
import { price } from '../../data/Data';
import './price.css';

const PriceCard = () => {
    return (
        <>
            <div className="d-flex flex-wrap">
                {price.map((item, index) => {
                    return (
                        <div key={index} className='col-12 col-md-6 col-lg-4 mb-4 mb-md-0 p-md-2 p-lg-3'>
                            <div key={index} className="p-2 py-4 px-md-3 rounded border box">
                                <div className="mb-4 text-center topbtn">
                                    {item.best && (
                                        <button className='btn btn-lg btn-primary text-light fw-bold rounded-pill'>
                                            {item.best}
                                        </button>
                                    )}
                                </div>
                                <h3 className='text-center fs-5 fw-bold'>{item.plan}</h3>
                                <h1 className='display-3 text-center fw-bold'><span className='fs-4'>$</span> {item.price}</h1>
                                <p className='mb-4 text-center'>{item.ptext}</p>
                                <ul className='list-unstyled'>
                                    {item.list.map((val, index) => {
                                        const { icon, text, change } = val;
                                        return (
                                            <li key={index} className='d-flex'>
                                                <label htmlFor="" className='rounded-circle me-2' style={{
                                                    background: change === "color" ? "#dc35451d" : "#27ae601f",
                                                    color: change === "color" ? "#dc3848" : "#27ae60",
                                                }}>{icon}</label>
                                                <p>{text}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <button className='btn btn-lg px-5 px-lg-4 px-xl-5 py-3 d-block mx-auto rounded-pill' style={{
                                    background: item.plan === "Standard" ? "#27ae60" : "#fff",
                                    color: item.plan === "Standard" ? "#fff" : "#27ae60",
                                    border: "5px solid #27ae601f",
                                }}>Start {item.plan}</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default PriceCard;
