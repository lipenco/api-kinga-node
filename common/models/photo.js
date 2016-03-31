import upload from "../../server/utils/pkgcloud-upload";

module.exports = function(Photo) {

  Photo.observe("before save", (ctx, next) => {
    upload("url")(ctx, next);
  });

};
