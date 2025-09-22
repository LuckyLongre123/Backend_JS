import { v2 as cloud } from "cloudinary";
import fs from "fs";

cloud.config({
  cloud_name: process.env.CLOUDINET_CLOUD_NAME,
  api_key: process.env.CLOUDINET_API_KEY,
  api_secret: process.env.CLOUDINET_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    //upload file
    const res = await cloud.uploader.upload(filePath, {
      resource_type: "auto",
    });
    // console.log(res);
    // console.log("file upload successfully. url: ", res.url);
    fs.unlinkSync(filePath);
    return res;
  } catch (error) {
    fs.unlinkSync(filePath); // delete temp file after opretion has vbeen failed.
    return null;
  }
};

export { uploadOnCloudinary };
