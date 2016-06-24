Template.sideNav.helpers({
  TaskCount: function() {
    return Tasks.find({status:"open"}).count();
  },
  RequestCount: function() {
    return Tasks.find({status:"waiting"}).count();
  },
});
