


const fs = require('fs');
const GoogleImages = require('google-images');
const secrets = JSON.parse(fs.readFileSync('image/secrets.json'));

const client = new GoogleImages(secrets.CSE_ID, secrets.API_KEY);


client.search('College of Staten Island')
    .then(images => {
        // Print images array as JSON
        console.log(JSON.stringify(images, null, 2));
    });

    
// // // paginate results
// // client.search('College of Staten Island', {page: 1});

// // // search for certain size
// // client.search('College of Staten Island', {size: 'large'});
