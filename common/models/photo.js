var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'hpymbyjxq',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = function(Photo) {

  Photo.observe("before save", (ctx, next) => {
    let data = ctx.instance || ctx.data;
    cloudinary.uploader.upload(ctx.instance.data, function(result) {
      data.url = result.url;
      next();
    });
  });

};
