import loopback from "loopback";
import multer from "multer";
import pkgcloud from "pkgcloud";
import pkgcloudStorage from "multer-storage-pkgcloud";
import { gcloud as pkgcloudConfig } from "../../config";

let client = pkgcloud.storage.createClient(pkgcloudConfig);

export default function upload(field, options) {
  return (ctx, next) => {
    options = options || {};
    options.name = typeof options.name === "function" ? options.name : ((ctx) => {
      return ctx.instance ? ctx.instance.id :
            (ctx.currentInstance ? ctx.currentInstance.id : null);
    });
    options.name = options.name(ctx);
    options.data = options.data || {};
    if (ctx.data) {
      options.data = ctx.data;
    }
    if (ctx.instance) {
      options.data = ctx.instance;
    }
    let loopbackCtx = loopback.getCurrentContext();
    if (!loopbackCtx || !loopbackCtx.active || !loopbackCtx.active.http) {
      return next();
    }
    let req = loopbackCtx.active.http.req;
    let res = loopbackCtx.active.http.res;
    uploadMiddleware(field, options, req, res, next);
  }
}

function uploadMiddleware(field, options, req, res, next) {
  options = options || {};
  options.type = options.type || "single";
  options.data = options.data || {};
  options.name = options.name || "";

  const pkgcloudMiddleware = pkgcloudUpload(field, options.type, destination);
  pkgcloudMiddleware(req, res, setBodyData)

  function destination(req, file, cb) {
    req.multerPkgcloudRecentContainer = [ pkgcloudConfig.container ];

    let fileName = file.originalname || "";
    const ext = fileName.substr(fileName.lastIndexOf('.'));

    if (options.name) {
      fileName = options.name + ext;
    }
    options.data[field] = pkgcloudConfig.url + fileName + "?" + (+new Date);
    cb(null, {
      container: pkgcloudConfig.container,
      remote: fileName
    });
  }

  function setBodyData() {
    for (let i in req.body) {
      options.data[i] = req.body[i];
    }
    next();
  }
}

function pkgcloudUpload(field, type, destination) {
  let storage;
  if (!process.env.STUB_FILEUPLOAD) {
    storage = pkgcloudStorage({
      client: client,
      skipContainerCheck: true,
      destination: destination
    });
  } else {
    storage = {
      _handleFile: (req, file, cb) => {
        let memoryStorage = multer.memoryStorage();
        let storageHandler = memoryStorage._handleFile.bind(
          memoryStorage, req, file, cb);
        destination(req, file, storageHandler);
      },
      _removeFile: (req, file, cb) => cb()
    };
  }
  let upload = multer({
    storage: storage
  });
  return upload[type](field);
}
