var Photo = require('./photo.js');
module.exports = function(Project) {
  Project.observe('before delete', function (ctx, next) {
    console.log("before destory triggeres", ctx.id)

    Photo.destroyAll({projectId : ctx.id})
    next();
  };

};
