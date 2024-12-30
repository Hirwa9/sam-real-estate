import React from 'react';
import Back from '../common/header/Back';
import img from '../images/about.jpeg';
import PropertyCard from '../common/PropertyCard';

const Blog = () => {
    return (
        <>
            <section className='mb-4 blog-out'>
                <Back name="Blog" title="Blog grid - Our Blogs" cover={img} />
                <div className="container recent">
                    <PropertyCard />
                </div>
            </section>
        </>
    )
}

export default Blog;
