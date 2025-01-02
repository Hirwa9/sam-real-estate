import React from 'react';
import PageInfo from '../common/header/PageInfo';
import img from '../images/about.jpeg';
import PropertyCard from '../common/PropertyCard';

const Blog = () => {
    return (
        <>
            <section className='mb-4 blog-out'>
                <PageInfo name="Blog" title="Blog grid - Our Blogs" cover={img} />
                <div className="container recent">
                    <PropertyCard />
                </div>
            </section>
        </>
    )
}

export default Blog;
