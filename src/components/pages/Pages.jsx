import React from "react";
import {
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import Home from "../home/Home";
import About from "../about/About";
import Services from "../services/Services";
import Properties from "../properties/Properties";
import Blog from "../blog/Blog";
import Pricing from "../pricing/Pricing";
import Contact from "../contact/Contact";
import Property from "../property/Property";
import Login from "../login/Login";
import Faqs from "../faqs/Faqs";
import Terms from "../terms/Terms";
import Admin from "../admin/Admin";
import Customer from "../user/Customer";

const Pages = () => {
    // Get the current path
    let location = useLocation();
    const currentLocation = location.pathname;
    // Excluded Header and Footer in specific routes
    const excludedRoutes = ["/admin", "/admin/dashboard"];
    const isExcludedRoute = excludedRoutes.includes(currentLocation) || currentLocation.includes('/user');

    return (
        <>
            {/* Conditionally render the Header */}
            {!isExcludedRoute && <Header />}
            <Routes>
                {/* App routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/properties/:filterParameter" element={<Properties />} />
                <Route path="/property/:propertyId" element={<Property />} />
                <Route path="/blogs" element={<Blog />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />
                {/* Admin/user routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/user/:userId" element={<Customer />} />

            </Routes>
            {/* Conditionally render the Footer */}
            {!isExcludedRoute && <Footer />}
        </>
    );
};

export default Pages;
