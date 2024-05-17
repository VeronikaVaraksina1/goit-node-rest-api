import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve('tmp'))
    },
    filename(req, file, cb) {
        const extname = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extname);
        const correctedBaseName = baseName.replace(/\s+/g, '-');
        const suffix = crypto. randomUUID();

        cb(null, `${correctedBaseName}-${suffix}${extname}`);
    }
});

 export const update = multer({storage});