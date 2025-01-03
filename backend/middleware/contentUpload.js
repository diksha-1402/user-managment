import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import constants from "../utils/constants.js";

const s3 = new S3Client({
  credentials: {
    accessKeyId: constants.AWS_S3_BUCKET_ACCESS_ID,
    secretAccessKey: constants.AWS_S3_BUCKET_SECRET_ID,
  },
  region: constants.AWS_S3_BUCKET_REGION,
});
const s3Storage = multerS3({
  s3: s3,
  bucket: constants.AWS_S3_BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    let fileName = "";
    let currentDate = Date.now();

    if (file.fieldname == "vedio") {
      fileName = `${constants.CONST_APP_VEDIO}${currentDate}${path.extname(
        file.originalname
      )}`;
    } else {
      fileName = `${currentDate}${path.extname(file.originalname)}`;
    }
    cb(null, fileName);
  },
});

let sanitizeFile = (file, cb) => {
  return cb(null, true);
};

const contentUpload = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    let result = sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

export default contentUpload;
