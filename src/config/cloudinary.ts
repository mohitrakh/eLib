import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinarySecret,
});

export default cloudinary;
