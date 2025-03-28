// routes/shapeUploads.js
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const modelPath = path.join(process.cwd(), "..", "client", "public");
const iconPath = path.join(process.cwd(), "..", "client", "public", "icons");

console.log("Model Path:", modelPath);
console.log("Icon Path:", iconPath);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "modelFile") {
            cb(null, modelPath);
        } else if (file.fieldname === "iconFile") {
            cb(null, iconPath);
        } else {
            cb(new Error("Invalid field name"), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post(
    "/",
    upload.fields([
        { name: "modelFile", maxCount: 1 },
        { name: "iconFile", maxCount: 1 }
    ]),
    (req, res) => {
        const modelFile = req.files["modelFile"] ? req.files["modelFile"][0] : null;
        const iconFile = req.files["iconFile"] ? req.files["iconFile"][0] : null;
        const modelUrl = modelFile ? `/${modelFile.filename}` : "";
        const iconUrl = iconFile ? `/icons/${iconFile.filename}` : "";
        res.status(200).json({ modelUrl, iconUrl });
    }
);

export default router;
