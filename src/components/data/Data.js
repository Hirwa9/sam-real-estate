import { Building, Check, Heart, Lightbulb, ListStar, Trophy, X } from "@phosphor-icons/react";

export const companyName = "Sam Realtor";
export const companyEmail = "hirwawilly9@gmail.com";
// export const companyEmail = "samrealtor60@gmail.com";
export const companyPhoneNumber1 = "250789305885";
export const companyPhoneNumber2 = "250788321583";
export const facebookLink = "https://www.facebook.com/profile.php?id=61567054102525";
export const instagramLink = "https://www.instagram.com/sam_real_estate_rwanda";
export const twitterLink = "";
export const linkedInLink = "";
export const companyAddress = "24 KG 414 St, Kigali, Rwanda";

export const nav = [
    {
        text: "Home",
        path: "/",
    },
    {
        text: "Properties",
        path: "/properties/all",
        subLinks: [
            { text: "House", path: "/properties/House", },
            { text: "Apartment", path: "/properties/Apartment", },
            { text: "Commercial", path: "/properties/Commercial", },
            { text: "Office", path: "/properties/Office", },
            { text: "For sale", path: "/properties/sale", },
            { text: "For rent", path: "/properties/rent", },
        ],
    },
    {
        text: "About Us",
        path: "/about",
        subLinks: [
            // { text: "Our agents", path: "/about#ourTeam", },
            { text: "Testimonials", path: "/about#testimonials", },
            // { text: "Blogs", path: "/blogs", },
            { text: "FAQs", path: "/faqs", },
            { text: "Get in touch", path: "/contact", },
            { text: "Terms", path: "/terms", },
        ],
    },
    {
        text: "Services",
        path: "/services",
    },
    // {
    //     text: "Blogs",
    //     path: "/blogs",
    //     subLinks: [
    //         { text: "Home", path: "/", },
    //         { text: "Home", path: "/", },
    //         { text: "Home", path: "/", },
    //     ],
    // },
    // {
    //     text: "Pricing",
    //     path: "/pricing",
    // },
    {
        text: "Contact",
        path: "/contact",
    },
];

export const featured = [
    {
        cover: "/images/Family_house_icon_image.png",
        name: "Houses",
        total: "122 Property",
        path: "/properties/House",
    },
    {
        cover: "/images/apartment_icon_image.png",
        name: "Apartments",
        total: "300 Property",
        path: "/properties/Apartment",
    },
    {
        cover: "/images/Office_&_studio_icon_image.png",
        name: "Offices",
        total: "80 Property",
        path: "/properties/Office",
    },
    {
        cover: "/images/Commercial_icon_image.jpg",
        name: "Commercials",
        total: "80 Property",
        path: "/properties/Commercial",
    },
    {
        cover: "/images/plot_icon_image.webp",
        name: "Land Plots",
        total: "10 Property",
        path: "/properties/Land Plot",
    },
];

export const aboutProperties = {
    allTypes: ["House", "Apartment", "Office", "Commercial", "Land Plot"],
    allCategories: ["For Sale", "For Rent"],
    paymentMethods: ["once", "annually", "monthly", "weekly", "daily", "hourly"],
    priceRanges: [
        { min: "1", max: "100,000" },
        { min: "100,000", max: "300,000" },
        { min: "300,000", max: "500,000" },
        { min: "500,000", max: "1,000,000" },
        { min: "1,000,000", max: "5,000,000" },
        { min: "5,000,000", max: "10,000,000" },
        { min: "10,000,000", max: "50,000,000" },
        { min: "50,000,000", max: "100,000,000" },
        { min: "100,000,000", max: "500,000,000" },
        { min: "500,000,000", max: "1,000,000,000" },
    ],
}

export const awards = [
    {
        name: "Properties",
        num: "317",
        icon: <Building size={40} />,
    },
    {
        name: "Property insights",
        num: "30 M",
        icon: <Lightbulb size={40} />,
    },
    {
        name: "Property likes",
        num: "15 M",
        icon: <Heart size={40} />,
    },
    {
        name: "Reviews",
        num: "5",
        icon: <ListStar size={40} />,
    },
];

// Sectors in Kigali
export const sectorsNames = [
    "Bumbogo", "Gahanga", "Gasabo", "Gatsata", "Gikondo", "Gikomero", "Gisozi", "Jabana", "Jali", "Kacyiru", "Kagarama", "Kanyinya", "Kanombe", "Kicukiro", "Kigarama", "Kimihurura", "Kimironko", "Kimisagara", "Kinyinya", "Mageragere", "Masaka", "Muhima", "Niboye", "Ndera", "Nduba", "Nyarugunga", "Nyakabanda", "Nyamirambo", "Remera", "Rusororo", "Rutunga", "Rwezamenyo"
];

export const team = [
    {
        cover: "/images/Samuel.jpg",
        list: "50",
        address: "Kigali, Rwanda",
        name: "Samuel Muhawenimana",
        socialMedia: [
            {
                link: facebookLink,
                icon: <i className='fa-brands fa-facebook-f'></i>
            },
            {
                link: linkedInLink,
                icon: <i className='fa-brands fa-linkedin'></i>
            },
            {
                link: twitterLink,
                icon: <i className='fa-brands fa-twitter'></i>
            },
            {
                link: instagramLink,
                icon: <i className='fa-brands fa-instagram'></i>
            }
        ],
    },
];

export const testimonials = [
    {
        cover: "/images/Samuel.jpg",
        name: "Samuel Muhawenimana",
        clientType: "Buyer",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, corrupti repellat eos quibusdam quasi eius nesciunt totam doloremque. quibusdam quasi eius nesciunt totam doloremque quibusdam quasi eius nesciunt totam doloremque.",
    },
    {
        cover: "/images/Samuel.jpg",
        name: "Samuel Muhawenimana",
        clientType: "Tenant",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, corrupti repellat eos quibusdam quasi eius nesciunt totam doloremque.",
    },
    {
        cover: "/images/Samuel.jpg",
        name: "Samuel Muhawenimana",
        clientType: "Tenant",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, corrupti repellat eos quibusdam quasi eius nesciunt totam doloremque. quibusdam quasi eius nesciunt totam doloremque quibusdam quasi eius nesciunt totam doloremque.",
    },
    {
        cover: "/images/Samuel.jpg",
        name: "Samuel Muhawenimana",
        clientType: "Tenant",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, corrupti repellat eos quibusdam quasi eius nesciunt totam doloremque. quibusdam quasi eius nesciunt totam doloremque quibusdam quasi eius nesciunt totam doloremque.",
    },
    {
        cover: "/images/Samuel.jpg",
        name: "Samuel Muhawenimana",
        clientType: "Tenant",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, corrupti repellat eos quibusdam quasi eius nesciunt totam doloremque. quibusdam quasi eius nesciunt totam doloremque quibusdam quasi eius nesciunt totam doloremque.",
    },
];

export const price = [
    {
        best: false,
        plan: "Basic",
        price: "29",
        ptext: "per user, per month",
        list: [
            { change: false, icon: <Check size={15} weight="bold" />, text: "99.5% Uptime Guarantee" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "120GB CDN Bandwidth" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "5GB Cloud Storage" },
            { change: "color", icon: <X size={15} weight="bold" />, text: "Personal Help Support" },
            { change: "color", icon: <X size={15} weight="bold" />, text: "Enterprise SIA" },
        ],
    },
    {
        best: "Best Value",
        plan: "Standard",
        price: "49",
        ptext: "per user, per month",
        list: [
            { change: false, icon: <Check size={15} weight="bold" />, text: "99.5% Uptime Guarantee" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "150GB CDN Bandwidth" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "10GB Cloud Storage" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "Personal Help Support" },
            { change: "color", icon: <X size={15} weight="bold" />, text: "Enterprise SIA" },
        ],
    },
    {
        best: false,
        plan: "Platinum",
        price: "79",
        ptext: "2 users, per month",
        list: [
            { change: false, icon: <Check size={15} weight="bold" />, text: "100% Uptime Guarantee" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "200GB CDN Bandwidth" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "20GB Cloud Storage" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "Personal Help Support" },
            { change: false, icon: <Check size={15} weight="bold" />, text: "Enterprise SIA" },
        ],
    },
];

export const footer = [
    {
        title: "LAYOUTS",
        text: [
            { list: "Home Page" },
            { list: "About Us" },
            { list: "Our Services" },
            { list: "Property Listing" },
            { list: "Contact" },
            { list: "Our Blogs" },
        ],
    },
    // {
    //     title: "ALL SECTIONS",
    //     text: [
    //         { list: "Headers" },
    //         { list: "Features" },
    //         { list: "Attractive" },
    //         { list: "Testimonials" },
    //         { list: "Videos" },
    //         { list: "Footers" },
    //     ],
    // },
    {
        title: "COMPANY",
        text: [
            { list: "About" },
            { list: "FAQs" },
            { list: "Login" },
            { list: "Terms of Use" },
            { list: "Privacy Portal" },
            { list: "Affiliates" },
            // { list: "Changeelog" },
        ],
    },
];


export const faqs = [
    {
        type: "general_real_estate_questions",
        title: "General Real Estate Questions",
        content: [
            {
                question: "What is the difference between a real estate agent and a broker?",
                answer: "A real estate agent is licensed to help people buy, sell, or rent properties, while a broker has additional training and can work independently, owning a brokerage and employing agents.",
            },
            {
                question: "How long does the home buying process take?",
                answer: "The timeline can vary, but on average, it takes about 30-45 days from the time an offer is accepted to the final closing.",
            },
            {
                question: "Do I need a real estate agent to buy or sell a home?",
                answer: "While it's possible to buy or sell property without an agent, hiring one provides expert guidance, helps with paperwork, negotiations, and access to more listings or buyers.",
            },
        ],
    },
    {
        type: "buying_property",
        title: "Buying Property",
        content: [
            {
                question: "What is the first step in buying a home?",
                answer: "The first step is usually to get pre-approved for a mortgage to determine your budget and demonstrate to sellers that you're a serious buyer.",
            },
            {
                question: "What are closing costs?",
                answer: "Closing costs are fees associated with the home purchase transaction, including lender fees, title insurance, and taxes. They typically range from 2-5% of the home's purchase price.",
            },
            {
                question: "What is a buyer's market vs. a seller's market?",
                answer: "A buyer's market happens when there are more properties for sale than buyers, giving buyers more negotiating power. A seller's market occurs when there are fewer properties available, leading to more competition among buyers.",
            },
        ],
    },
    {
        type: "selling_property",
        title: "Selling Property",
        content: [
            {
                question: "How do I determine the value of my home?",
                answer: "You can get a Comparative Market Analysis (CMA) from a real estate agent or hire an appraiser to determine your home's value based on recent sales and other market factors.",
            },
            {
                question: "How can I make my home more attractive to buyers?",
                answer: "Simple improvements like decluttering, fresh paint, and landscaping can make a big difference. Staging the home to highlight its best features can also help.",
            },
            {
                question: "What is the best time of year to sell a house?",
                answer: "Spring and summer are typically the busiest seasons for real estate. However, every market is different, and there are advantages to selling during other times, such as less competition.",
            },
        ],
    },
    {
        type: "renting_property",
        title: "Renting Property",
        content: [
            {
                question: "What is the process for renting a property?",
                answer: "The rental process usually includes searching for properties, viewing them, submitting an application, getting approval, signing a lease, and paying a security deposit and rent.",
            },
            {
                question: "Do I need renters' insurance?",
                answer: "While not always required, renters' insurance is highly recommended to protect your personal belongings and provide liability coverage in case of accidents.",
            },
            {
                question: "How much rent can I afford?",
                answer: "A common rule is to spend no more than 30% of your gross monthly income on rent to ensure it's manageable alongside other expenses.",
            },
        ],
    },
    {
        type: "mortgage_financing",
        title: "Mortgage and Financing",
        content: [
            {
                question: "What is a mortgage pre-approval?",
                answer: "A pre-approval is a process in which a lender evaluates your financials and conditionally approves you for a loan, showing sellers you're serious about buying.",
            },
            {
                question: "What types of mortgages are available?",
                answer: "There are several types of mortgages, including fixed-rate, adjustable-rate, FHA loans, VA loans, and jumbo loans, each with its own advantages depending on your situation.",
            },
            {
                question: "Can I get a mortgage with bad credit?",
                answer: "It may be more difficult, but it's possible to get a mortgage with bad credit. However, you may have to pay a higher interest rate or provide a larger down payment.",
            },
        ],
    },
    {
        type: "legal_documentation",
        title: "Legal and Documentation",
        content: [
            {
                question: "What is a deed, and why is it important?",
                answer: "A deed is a legal document that transfers property ownership from the seller to the buyer. It's important because it serves as proof of ownership.",
            },
            {
                question: "What is title insurance?",
                answer: "Title insurance protects both the buyer and the lender from future claims against the property due to past disputes over ownership or unpaid liens.",
            },
            {
                question: "What is earnest money?",
                answer: "Earnest money is a deposit made by a buyer to show they are serious about purchasing a property. If the deal falls through due to the buyer's fault, the seller may keep the earnest money.",
            },
        ],
    },
    {
        type: "investment_properties",
        title: "Investment Properties",
        content: [
            {
                question: "What should I consider before buying an investment property?",
                answer: "Look at location, property condition, potential rental income, and local market trends. Make sure you calculate all expenses to determine the return on investment (ROI).",
            },
            {
                question: "How do property taxes affect investment properties?",
                answer: "Property taxes vary by location and can significantly impact your profits. Research the tax rates and any potential increases in the area where you're buying.",
            },
            {
                question: "Should I manage my rental property or hire a management company?",
                answer: "If you live far away or have multiple properties, it may be beneficial to hire a property management company to handle day-to-day operations and tenant relations.",
            },
        ],
    },
    {
        type: "miscellaneous",
        title: "Miscellaneous",
        content: [
            {
                question: "What happens if I break my lease early?",
                answer: "Breaking a lease may result in penalties or paying the remaining rent. However, some leases allow for early termination with proper notice and fees.",
            },
            {
                question: "What is an HOA, and how does it affect property ownership?",
                answer: "A Homeowners Association (HOA) is a group that enforces rules and guidelines within a community. If you buy a property in an HOA-governed community, you must pay HOA fees and abide by the rules.",
            },
            {
                question: "How do I prepare for a home inspection?",
                answer: "Clean and maintain accessible areas, check for any obvious issues like leaks, and be prepared to answer questions about the property's condition.",
            },
        ],
    },
];