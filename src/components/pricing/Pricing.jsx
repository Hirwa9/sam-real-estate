import React from 'react';
import PageInfo from '../common/header/PageInfo';
import img from '../images/pricing.jpg';
import PriceCard from '../home/price/PriceCard';

const Pricing = () => {
    return (
        <>
            <section className='mb-4 service'>
            <PageInfo name="30 days money back guarantee" title="No Extra Fees. FriendIy Support" cover={img}/>
                <div className="price container">
                    <PriceCard />
                </div>
            </section>
        </>
    )
}

export default Pricing;
