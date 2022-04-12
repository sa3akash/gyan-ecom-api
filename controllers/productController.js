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
// create a product
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
      //product add to database
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


// update a product
async update(req, res, next){
  // multipast/form data
  handleMultipulData(req, res, async (err) => {
    if (err) {
      return next(CustomErrorHandler.multerServerError(err.message));
    }
  // console.log(req.file);
        let filePath;
        if(req.file){
          filePath = req.file.path;
        }
        
      // validatae start
      const productValidator = Joi.object({
        name: Joi.string(),
        price: Joi.number(),
        size: Joi.string()
      });
  // validator
  const { error } = productValidator.validate(req.body);
  if (error) {
    // delete photo
   if(req.file){
    fs.unlink(`${appRoot}/${filePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.multerServerError(err.message));
      }
    });
   }
    return next(error); // joi validation error
  }

        const { name, price, size } = req.body;
        //product add to database
            let documentUpdate;
            try {
              documentUpdate = await Product.findOneAndUpdate({_id: req.params.id},{
                name,
                price,
                size,
                ...(req.file && {image: filePath})
              },{ new: true });

            } catch (err) {
              return next(err);
            }
        console.log(documentUpdate);
        res.status(201).json(documentUpdate);

      });
    },

// delete a product

    async distroy(req, res, next){
      const deleteDocument  = await Product.findOneAndRemove({_id: req.params.id},{new: true})
      if(!deleteDocument){
        return next(new Error("Nothing to Delete!"))
      }
      // image delete 
      const imagePath = deleteDocument.image;
      fs.unlink(`${appRoot}/${imagePath}`, (err)=>{
        if(err){
          return next(new Error("Internal Servs"))
        }
      })
      res.json(deleteDocument);
    },


    // get all prodcuts 

   async index(req, res, next){
     // pagination library name mongoose-pagination

     let allProduct;
      try{
          allProduct = await Product.find().select('-updatedAt -__v');
      } catch(err){
        return next(CustomErrorHandler.multerServerError())
      }

      res.json(allProduct);
    }
};

export default productController;

