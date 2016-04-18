var Photo = require('./photo.js');
module.exports = function(Project) {
  Project.observe('before delete', function (ctx, next) {
    console.log("before destory triggeres", ctx.where.id, ctx.where, next)

    Photo.destroyAll({projectId : ctx.where.id})
    next();
  });

};
