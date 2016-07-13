SyncedCron.add({
  name: 'Update user ratings',
  schedule: function (parser) {
    // parser is a later.parse object
    // return parser.text('every 1 minutes');
    return parser.text('on the last day of the month');
  },
  job: function () {
    // find every tasks completed on last month
    var tasks = Tasks.find({ closedAt: { $gte: moment().subtract(1, 'months').toDate() } });
    tasks.forEach(function (task) {
      _.each(task.ratings, function (value, key) {
        Rating.updateUserRating(key, value);
      });
      
    }, this);
    // get volunteer ratings
    // add users average
    // get requester ratings
    // add users average
  }
});



Rating = {
  updateUserRating: function (userId, rating) {
    Meteor.users.update({_id: userId}, {$inc:{totalRating:rating, numberOfRating:1}}); 
    } 
}