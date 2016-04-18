var Photo = require('./photo.js');
module.exports = function(Project) {
  Project.observe('before delete', function (ctx, next) {
    console.log("before destory triggeres", ctx)

    Photo.destroyAll({projectId : ctx})
    next();
  });

};
