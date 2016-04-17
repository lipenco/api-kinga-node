var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'hpymbyjxq',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = function(Photo) {

  Photo.observe("before create", (ctx, next) => {
    console.log(ctx.instance)
    let data = ctx.instance || ctx.data;

    return cloudinary.uploader.upload(
      "https://kinga-api.herokuapp.com/" + data.tempurl, function(result) {
        if (result) {
          data.url = result.url;
          data.public_id = result.public_id;
          next();
        } else {
          next();
        }
    });

  });

};
