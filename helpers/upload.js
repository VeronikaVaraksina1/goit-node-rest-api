import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve('temp'))
    },
    filename(req, file, cb) {
        const extname = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extname);
        const suffix = crypto. randomUUID();

        cb(null, `${baseName}-${suffix}${extname}`);
    }
})
 export const update = multer({storage});