const media = {
    images: [
        { url: "/images/propertyImages/property_id1/Apartments_image.jpg", isPrimary: true },
        { url: "/images/propertyImages/property_id1/Bedroom_image.jpg" },
        { url: "/images/propertyImages/property_id1/Bedroom_image2.jpg" },
        { url: "/images/propertyImages/property_id1/Kitchen_image.jpg" },
        { url: "/images/propertyImages/property_id1/Kitchen_image2.jpg" },
        { url: "/images/propertyImages/property_id1/LivingRoom_image.jpg" },
        { url: "/images/propertyImages/property_id1/Lounge_image.jpg" },
        { url: "/images/propertyImages/property_id1/City1_image.jpg" },
        { url: "/images/propertyImages/property_id1/City2_image.jpg" },
        { url: "/images/propertyImages/property_id1/City3_image.jpg" },
        { url: "/images/propertyImages/property_id1/Kigali1_image.jpg" },
        { url: "/images/propertyImages/property_id1/Kigali2_image.jpeg" },
        { url: "/images/propertyImages/property_id1/Kigali3_image.jpg" },
    ],
    video: "/videos/propertyImages/property_id1/Apartments_video.mp4",
}

const emails = [
    'hirwawilly9@gmail.com',
    'hirwaWilly5@gmail.com',
    '::1',
    '::26',
];


export const consoleTest = () => {
    const stringified = JSON.stringify(emails);
    const parsed = JSON.parse(stringified);

    const added = parsed.push('I was added');
    
    const stringifiedFinal = JSON.stringify(added);
    const paserdFinal = JSON.parse(stringifiedFinal);


    console.log('stringified ', stringified);
    console.log('parsed ', parsed , '\n\n\n\n');
    console.log('stringifiedFinal ', stringifiedFinal);
    console.log('paserdFinal ', paserdFinal);

    // console.log(JSON.stringify(emails));
    // console.log(typeof Array(JSON.parse(JSON.stringify(emails))));
}


    // console.log(JSON.stringify(JSON.stringify(

    //     {"images":[{"url":"/images/propertyImages/property_id1/City1_image.jpg","isPrimary":true},{"url":"/images/propertyImages/property_id1/Bedroom_image.jpg"},{"url":"/images/propertyImages/property_id1/Bedroom_image2.jpg"},{"url":"/images/propertyImages/property_id1/Kitchen_image.jpg"},{"url":"/images/propertyImages/property_id1/Kitchen_image2.jpg"},{"url":"/images/propertyImages/property_id1/LivingRoom_image.jpg"},{"url":"/images/propertyImages/property_id1/Lounge_image.jpg"},{"url":"/images/propertyImages/property_id1/Apartments_image.jpg"},{"url":"/images/propertyImages/property_id1/City2_image.jpg"},{"url":"/images/propertyImages/property_id1/City3_image.jpg"},{"url":"/images/propertyImages/property_id1/Kigali1_image.jpg"},{"url":"/images/propertyImages/property_id1/Kigali2_image.jpeg"},{"url":"/images/propertyImages/property_id1/Kigali3_image.jpg"}],"video":"/videos/propertyImages/property_id1/Apartments_video.mp4"}

    // )))
