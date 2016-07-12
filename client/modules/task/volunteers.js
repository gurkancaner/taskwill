Template.volunteers.onRendered(function () {
  $('.collapsible').collapsible();
});
Template.volunteers.helpers({
  Volunteers: function () {
    var task = Tasks.findOne(Session.get("selectedTaskId"));
    if (task) {
      $('#rate-section').toggle(task.status == "done");
    }
    var volunteersForTask = task && task.volunteers ? task.volunteers : [];
    var users = Meteor.users.find({ _id: { $in: volunteersForTask } }).map(function (doc) {
      if (doc.profile.tags) {
        var tags = doc.profile.tags.map(function (tagId) {
          return Tags.findOne(tagId);
        });
        _.extend(doc.profile, {
          "tags": tags
        });
      }
      var isApproved = task.approvedVolunteers ? task.approvedVolunteers.indexOf(doc._id) !== -1 : false;
      var rating = 0.001;
      if (task.ratings) {
        rating = task.ratings[doc._id];
        if (rating == undefined)
          rating = 0.001;
      }
      return _.extend(doc, {
        isApproved: isApproved,
        rating: rating
      });
    });
    return users;
  },
  isChecked: function (status) {
    return Session.get("selectedTaskId") && Tasks.findOne(Session.get("selectedTaskId")) && Tasks.findOne(Session.get("selectedTaskId")).status == status ? "checked" : "";
  },
  isRateble: function () {
    var closedAt = safeGet(Tasks.findOne(Session.get("selectedTaskId")), "closedAt");
    return closedAt >= moment().subtract(1, 'weeks').toDate();
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
  "click  input[name=status-group]:radio": function (event, target) {
    var status = $('.card-action input[name=status-group]:checked').attr("id");
    var taskId = Session.get("selectedTaskId");
    $("#rate-section").toggle(status == "done");
    Meteor.call("updateTaskStatus", taskId, status, function (error, result) {
      if (error)
        console.log(error);
    });
    return false;
  },
  "click .rating-bar": function (event, target) {
    var rating = $(event.currentTarget).data('userrating');
    var userId = $(event.currentTarget).parent().data('value');
    var taskId = Session.get("selectedTaskId");
    Meteor.call("rateVolunteer", taskId, userId, rating, function (error, result) {
      if (error)
        console.log(error);
    });
  }
});