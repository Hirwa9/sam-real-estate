import React from "react";
import "./featured.css"
// import Heading from "../../common/Heading";
import FeaturedCard from "./FeaturedCard";
import Heading from "../../common/Heading";

const Featured = () => {
    return (
        <>
            <section className="featured">
                <div className="container">
                    <Heading
                        title="Featured property Types"
                        subtitle="Find Your Type of Property. Explore a range of properties, from modern houses, apartments for rent or sale to prime land and lot listings in sought-after locations"
                        hType="h2"
                    />
                    <FeaturedCard />
                </div>
            </section>
        </>
    );
}


export default Featured;