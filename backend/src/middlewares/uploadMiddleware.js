const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Asegurate de crear esta carpeta 'public/uploads' en tu backend
    cb(null, path.join(__dirname, '../../public/uploads')); 
  },
  filename: function (req, file, cb) {
    // Le pone un timestamp al nombre para que no se repita
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;