import { v2 as cloud } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: 'dyov4wxur',
    api_key: '339312828587331',
    api_secret: '9T-7UbmaScYAhIDs6xVirmj3Ybo' // add to your in .enc file
});

const uploadOnCloudinery = async (filePath) => {
    try {
        if (!filePath) return null;
        //upload file
        const res = await cloud.uploader.upload(filePath, {
            resource_type: 'auto'
        })
        console.log(res)
        console.log('file upload successfully. url: ', res.url)
        return res;
    } catch (error) {
        fs.unlinkSync(filePath) // delete temp file after opretion has vbeen failed.
        return null;
    }
}

export { uploadOnCloudinery };