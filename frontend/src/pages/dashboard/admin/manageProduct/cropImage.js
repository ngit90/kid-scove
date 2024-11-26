export default function getCroppedImg(imageSrc, pixelCrop) {
    const image = new Image();
    image.src = imageSrc;
    
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
  
        // Set canvas size to match the cropped area
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        // Draw the image onto the canvas with the appropriate scaling and crop
        ctx.drawImage(
          image,
          pixelCrop.x * scaleX,
          pixelCrop.y * scaleY,
          pixelCrop.width * scaleX,
          pixelCrop.height * scaleY,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        // Get the base64 string of the cropped image
        const base64Image = canvas.toDataURL('image/jpeg');
        resolve(base64Image);
      };
      image.onerror = (error) => reject(error);
    });
  }
  