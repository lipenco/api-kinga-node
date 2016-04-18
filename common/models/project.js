var loopback = require('loopback');
var Photo = loopback.getModel("Photo")

module.exports = function(Project) {
  Project.observe('before delete', function (ctx, next) {
    // ctx.photos.destroyAll()
    console.log("before destory triggeres", ctx.where.id)

    Photo.destroyAll({projectId : ctx.where.id})
    next();
  });

};
