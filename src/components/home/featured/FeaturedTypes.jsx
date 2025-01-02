import React from "react";
import "./featured.css"
// import Heading from "../../common/Heading";
import FeaturedTypesCard from "./FeaturedTypesCard";
import Heading from "../../common/Heading";

const FeaturedTypes = () => {
    return (
        <>
            <section className="featured-types">
                <div className="container">
                    <Heading
                        title="Listing Property Types"
                        subtitle="Find Your Type of Property. Explore a range of properties, from modern houses, apartments for rent or sale to prime land and lot listings in sought-after locations"
                        hType="h2"
                    />
                    <FeaturedTypesCard />
                </div>
            </section>
        </>
    );
}


export default FeaturedTypes;