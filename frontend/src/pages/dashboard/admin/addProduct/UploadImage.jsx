import React, { useState } from 'react'

import axios from 'axios'
import { getBaseUrl } from '../../../../utils/baseURL';

const UploadImage = ({ name, setImages }) => {
    const [loading, setLoading] = useState(false);
    const [urls, setUrls] = useState([]);
    const [url, setUrl] = useState("");

    // base64 functionality

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // Upload a single Base64 image to the server
    const uploadSingleImage = (base64) => {
      axios
          .post(`${getBaseUrl()}/uploadImage`, { image: base64 })
          .then((res) => {
              const imageUrl = res.data;
              setUrl(imageUrl);
              console.log(imageUrl);
          })
          .catch((error) => {
              console.error(error);
          });
  };

  // Handle file selection and upload
  const uploadImages = async (event) => {
    const files = event.target.files;
    console.log('files',files);
    if (files.length === 0) {
      return;
    }

    setLoading(true);
    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const base64 = await convertBase64(files[i]);
        //const imageUrl = await uploadSingleImage(base64); // Upload each image
        uploadSingleImage(base64);
        //uploadedUrls.push(imageUrl); // Store the URL
         uploadedUrls.push(url); // Store the URL
      }
      setUrls(uploadedUrls); // Update the state with all uploaded URLs
      //console.log('images',uploadImages);
      setImages(uploadedUrls); // Pass the URLs to the parent component
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
    }
  };


    return (
        <div>
            <label htmlFor={name}>Upload Images</label>
            <input type="file"
                name={name}
                id={name}
                multiple
                onChange={uploadImages}
                className='add-product-InputCSS' />
            {
                loading && (
                    <div className='mt-2 text-sm text-blue-600'>Uploading images...</div>
                )
            }
            <div className="mt-4 flex gap-2 flex-wrap">
                {urls.map((url, index) => (
                <img key={index} src={url} alt={`Uploaded ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                ))}
            </div>
        </div>
    )
}

export default UploadImage