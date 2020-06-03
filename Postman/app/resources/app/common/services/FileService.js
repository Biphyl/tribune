const fs = require('fs'),
      path = require('path'),
      mkdirp = require('mkdirp');

/**
 * used to create directory
 * @param  {String} source
 *
 * @returns {Promise}
 */
function mkdir (source) {
  return new Promise((resolve, reject) => {
    mkdirp(source, (err) => {
      if (err) {
        return reject(new Error(`FileService-mkdir: Error while creating directory ${err.message}`));
      }
      return resolve();
    });
  });
}

/**
 * Used to delete directory or file recursively
 *
 * @param  {String} source
 *
 * @returns {Promise}
 */
function remove (source) {
  return lstat(source)
    .then((stat) => {
      if (stat.isDirectory() && !stat.isSymbolicLink()) {
        return readdir(source)
          .then((children) => {
            return Promise.all(children.map((child) => remove(path.join(source, child))));
          })
          .then(() => {
            return rmdir(source);
          });
      } else {
        return unlink(source);
      }
    })
    .catch((err) => {
      if (err && (err.code === 'ENOENT')) {
        return;
      }

      return Promise.reject(new Error(`FileService~remove: Could not remove files. ${err.message}`));
    });
}

/**
 * return fs lstat for file at a path
 *
 * @param  {String} path
 */
function lstat (path) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (err, stat) => {
      if (err) {
        return reject(err);
      }
      return resolve(stat);
    });
  });
}

/**
 * @param  {String} path
 */
function readdir (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    });
  });
}

/**
 * @param  {String} path
 */
function rmdir (path) {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

/**
 * @param  {String} path
 */
function unlink (path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

/**
 * Writes to a file
 *
 * @param  {String}  filePath - Absolute config file path
 * @param  {String}  data - Data to be written to the file
 *
 * @returns  {Promise}
 */
function write (filePath, data) {
  let fileDirPath = path.dirname(filePath);

  return mkdir(fileDirPath)
    .then(() => {
      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        });
      });
    });
}

/**
 * Reads a file if it exists. Resolves with empty string if it does not.
 *
 * @param  {String}  filePath - Absolute config file path
 *
 * @returns  {Promise}
 */
function read (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        return reject(err);
      }

      return resolve(fileData);
    });
  });
}

module.exports = {
  remove,
  mkdir,
  read,
  write
};
