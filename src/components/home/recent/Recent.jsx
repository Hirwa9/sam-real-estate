import React from "react";
import "../../common/propertyCard.css"
// import Heading from "../../common/Heading";
import PropertyCard from "../../common/PropertyCard";
import Heading from "../../common/Heading";
import { ArrowRight } from "@phosphor-icons/react";

const Recent = () => {
    return (
        <>
            <section className="p-2 p-md-3 recent">
                <div className="px-0 container-fluid">
                    <Heading
                        title="Recent Property Listed"
                        subtitle="Check out our most recent listing. Stay updated with the latest properties and make well-informed decisions with our comprehensive details and expert support."
                        hType="h2"
                    />
                    <PropertyCard limited />
                    <a href="/properties/all" className="d-block w-fit ms-auto me-4 me-md-auto my-3 my-md-5  text-decoration-none see-more-link">See more <ArrowRight weight="bold" /></a>
                </div>
            </section>
        </>
    );
}

export default Recent;