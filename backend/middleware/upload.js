

const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter file (MIME type) yang kita izinkan
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf", // PDF
    "application/msword", // doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "image/jpeg", // jpg/jpeg
    "image/png", // png
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Terima file
  } else {
    cb(new Error("Format file tidak didukung!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, 
  },
});

module.exports = upload;
