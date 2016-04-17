var Photo = require('./photo.js');
module.exports = function(Project) {
  Project.beforeDestroy = function(next, modelInstance) {
    console.log("before destory triggeres")

    Photo.destroyAll({projectId : modelInstance.id})
    next();
  };

};
