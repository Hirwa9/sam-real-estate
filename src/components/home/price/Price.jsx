import React from "react";
import PriceCard from "./PriceCard";

const Price = () => {
    return (
        <>
            <section className="p-3 price">
                <div className="container">
                    <div className="text-center col-9 m-auto my-5 heading">
                        <h2 className="col-10 col-md-12 m-auto mb-3 display-6 text-balance">Select Your Preferences</h2>
                        <p className="small">
                            Choose your type of properties and we'll keep you posted about their availability
                        </p>
                    </div>
                    <PriceCard />
                </div>
            </section>
        </>
    );
};

export default Price;
