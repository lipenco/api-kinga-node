var Photo = req.app.models.Photo;
module.exports = function(Project) {
  Project.observe('before delete', function (ctx, next) {
    console.log("before destory triggeres", ctx.where.id)

    Photo.destroyAll({projectId : ctx.where.id})
    next();
  });

};
