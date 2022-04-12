import { Product } from "../models";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const handleMultipulData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
  // image upload validation
  fileFilter: (req, file, cb)=>{
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {cb(null, true)} 
      else {
        cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      }
  }
}).single("image");

const productController = {
  async store(req, res, next) {
    // multipast/form data
    handleMultipulData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.multerServerError(err.message));
      }
      // console.log(req.file);
      const filePath = req.file.path;
      // validatae start
      const productValidator = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });
      // validator
      const { error } = productValidator.validate(req.body);
      if (error) {
        // delete photo
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.multerServerError(err.message));
          }
        });
        return next(error); // joi validation error
      }

      const { name, price, size } = req.body;

      let document;

      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });
      } catch (err) {
        return next(err);
      }

      res.status(201).json(document);
    });
  },
};

export default productController;
