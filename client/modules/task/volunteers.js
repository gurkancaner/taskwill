Template.volunteers.onRendered(function () {
  $('.collapsible').collapsible();
});
Template.volunteers.helpers({
  Volunteers: function () {
    var task = Tasks.findOne(Session.get("selectedTaskId"));
    var volunteersForTask = task && task.volunteers ? task.volunteers : [];
    return Meteor.users.find({ _id: { $in: volunteersForTask } }).map(function (doc) {
      if (doc.profile.tags) {
        var tags = doc.profile.tags.map(function (tagId) {
          return Tags.findOne(tagId);
        });
        _.extend(doc.profile, {
          "tags": tags
        });
      }
      var isApproved = task.approvedVolunteers ? task.approvedVolunteers.indexOf(doc._id) !== -1 : false;
      return _.extend(doc, {
        isApproved: isApproved
      });
    });
  },
  isAssigned: function(){
    return Session.get("selectedTaskId") && Tasks.findOne(Session.get("selectedTaskId")).status == "assigned";
  }
});
Template.volunteers.events({
  "click  .volunteer-approve": function (event, target) {
    event.preventDefault();
    var status = $(event.target).prop("checked");
    Meteor.call("approveVolunteer", Session.get("selectedTaskId"), this._id, status, function (error, result) {
      if (error)
        console.log(error);
    });
    return false;
  },
  "click  .volunteer-action": function (event, target) {
    Meteor.call("updateTaskStatus", Session.get("selectedTaskId"), $(event.target).data("status"), function (error, result) {
      if (error)
        console.log(error);
    });
    return false;
  }
});