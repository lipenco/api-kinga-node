var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'hpymbyjxq',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = function(Photo) {

  Photo.observe("before save", (ctx, next) => {
    let data = ctx.instance || ctx.data;

    return cloudinary.v2.uploader.upload(
      "https://kinga-api.herokuapp.com/" + data.tempurl, function(result, err) {
        console.log(result, err)
        if (result) {
          data.url = result.url;
        }
      next();
    });

  });

};
