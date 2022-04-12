import {Product} from "../models"
import multer from "multer";
import path from "path"
import CustomErrorHandler from "../services/CustomErrorHandler"

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

const handleMultipulData = multer({storage, limits:{fileSize: 1000000 * 5 }}).single('image');

const productController = {
    async store (req, res, next){
        // multipast/form data
        handleMultipulData(req, res, (err)=>{
            if(err){
                return next(CustomErrorHandler.multerServerError(err.message));
            }
            console.log(req.file);
             // const filePath = req.file.path
            res.json()
        });
        
    }
}


export default productController;