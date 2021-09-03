const fs = require("fs");

const deleteFile = (fileName) => {
  if (fs.existsSync("public/uploads/" + fileName)) {
    fs.unlink("public/uploads/" + fileName, (error) => {
      if (error) throw error;
    });
  }
  return;
};

module.exports = deleteFile;
