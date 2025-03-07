import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "fs/promises";
import bookModal from "./bookModal";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    // req.files will get you the files
    // we need to specify the type otherwise it will have the typesript error on the line 12
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const fileName = files.coverImage[0]?.filename;
    const fileMimeType = files.coverImage[0]?.mimetype.split("/").at(-1);
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    // Upload the file to cloudinary
    // to upload file to the cloudinary we need to get the filepath of the file to be uploaded
    // filename_override is basically the name of the file
    // folder is the folder where we want to upload the file
    // format is the format of the file (jpg, png, etc.)
    // cloudinary will return the public_id and secure_url of the uploaded file
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: fileMimeType, // optional format
    });

    // Code for the uploading pdf file
    const pdfFileName = files.file[0]?.filename;
    const pdfFileMimeType = files.file[0]?.mimetype.split("/").at(-1); // we can hard code as well we need pdf only
    const pdfFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      pdfFileName
    );
    // Upload the pdf file to cloudinary
    // to upload file to the cloudinary we need to get add extra field/configuration called "resource_type"
    // We can now upload file to the cloudinary but still we can deliver the file only upload
    // To deliver the file we need to enable the "Allow delivery of PDF and ZIP files" setting in cloudinary panel
    const pdfUploadResult = await cloudinary.uploader.upload(pdfFilePath, {
      resource_type: "raw", // required for the pdf files
      filename_override: pdfFileName,
      folder: "book-pdfs",
      format: "pdf", // optional format
    });
    console.log("pdf upload result: ", pdfUploadResult);
    console.log("uploadResult", uploadResult);

    // Create the book in the database

    const book = await bookModal.create({
      title,
      genre,
      coverImage: uploadResult.secure_url,
      file: pdfUploadResult.secure_url,
      author: "67cb20ab12e3634600c4893c",
    });

    // delete the local files after uploading to cloudinary
    await Promise.all([fs.unlink(filePath), fs.unlink(pdfFilePath)]);

    res.status(201).json({
      message: "Book created suc  cessfully!",
      data: book,
    });
  } catch (error) {
    next(createHttpError(500, "Error while creating a book"));
  }
};

export { createBook };
