Template.sideNav.helpers({
  TaskCount: function() {
    return Tasks.find({status:"open"}).count();
  },
  MyTaskCount: function() {
    return Tasks.find({status:"open", volunteers:Meteor.userId()}).count();
  },
  RequestCount: function() {
    return Tasks.find({status:"waiting"}).count();
  },
  NyRequestCount: function() {
    return Tasks.find({status:"waiting", createdBy:Meteor.userId()}).count();
  },
});
