import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure storage for different file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = "uploads/";

        if (file.fieldname === "company_logo_path") {
            uploadPath += "logos/";
        } else if (file.fieldname === "rhp") {
            uploadPath += "rhp/";
        }else if (file.fieldname === "drhp") {
            uploadPath += "drhp/";
        }

        ensureDirectoryExistence(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

// File filter (only allow images & PDFs)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
    if (!allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
        return cb(new Error("Only PNG, JPG, JPEG, and PDF files are allowed!"), false);
    }
    cb(null, true);
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

export default upload;
