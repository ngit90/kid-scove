const cloudinary = require("cloudinary").v2;

require("dotenv").config(); 

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});


// cloudinary.config({
//   cloud_name: 'dn2gccqlw',
//   api_key: '723175676372248',
//   api_secret: 'oENnjmF-Jb9xHjK-u66PS9cQb50',
// });

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};


module.exports = (image) => {
  //image = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};


/*module.exports = (images) => {
  // images => array of base64 encoded images or file paths
  return new Promise((resolve, reject) => {
    const uploadPromises = images.map((image) => {
      return new Promise((resolveImage, rejectImage) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
          if (error) {
            return rejectImage({ message: error.message });
          }
          if (result && result.secure_url) {
            console.log(result.secure_url);
            return resolveImage(result.secure_url); // Return the image URL
          }
        });
      });
    });

    // Wait for all image uploads to complete
    Promise.all(uploadPromises)
      .then((urls) => {
        resolve(urls); // Return an array of image URLs
      })
      .catch((error) => {
        console.log(error.message);
        reject({ message: error.message });
      });
  });
};*/