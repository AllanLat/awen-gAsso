import { Blob } from 'buffer';

function transformFilesToBlobs(files) {
    const blobFiles = {};
  
    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        const fileArray = files[key];
  
        if (Array.isArray(fileArray)) {
          blobFiles[key] = fileArray.map((file) => {
            const blob = new Blob([file.buffer], { type: file.mimetype });
            return blob;
          });
        } else {
          // If there's only one file, create a single blob
          blobFiles[key] = new Blob([fileArray.buffer], { type: fileArray.mimetype });
        }
      }
    }
  
    return blobFiles;
  }

  export { transformFilesToBlobs };