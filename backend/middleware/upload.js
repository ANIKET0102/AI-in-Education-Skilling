const multer = require('multer');
const fs = require('fs');
const path = require('path');

// This automatically creates the 'uploads' folder if it is missing!
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'uploads/');
},
filename: function (req, file, cb) {
// Adds a timestamp to the file name so you can upload multiple files with the same name
cb(null, Date.now() + '-' + file.originalname);
}
});

const upload = multer({ storage: storage });

module.exports = upload;