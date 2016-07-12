/**
 * Publish the users
 */
Meteor.publish('tasks', function () {
  var level = 0;
  if (this.userId) {
    if (Role.userCan("manageTasks", this.userId)) {
      return Tasks.find();
    } else {
      var user = Meteor.users.findOne(this.userId);
      if (user)
        level = user.level;
    }
  }
  return Tasks.find({ level: { $lte: level }, status: "open" });
});

Meteor.methods({
  //creates or updates role
  "createTask": function (title, description, hours, dueDate, tags, level, location) {
    Meteor.checkUserCan("createTask");
    if (Meteor.userCan("manageTasks")) {
      if (!level)
        level = 0;
    } else
      level = 0;

    Tasks.insert({
      title: title,
      description: description,
      hours: hours,
      dueDate: dueDate,
      createdBy: Meteor.userId(),
      createdAt: new Date(),
      tags: tags,
      level: level,
      location: location,
      status: "waiting"//waiting, open, assigned, done, rejected
    });
  },
  "updateTask": function (id, title, description, hours, dueDate, tags, level, status, location) {
    var selector = { _id: id, createdBy: Meteor.userId() };
    var valuesObj = {
      title: title,
      description: description,
      hours: hours,
      dueDate: dueDate,
      updatedBy: Meteor.userId(),
      updatedAt: new Date(),
      tags: tags,
      location: location
    };
    if (Meteor.userCan("manageTasks")) {
      selector = { _id: id }
      valuesObj.level = Number(level);
      if (status) {
        valuesObj.status = status;
      }
    }
    Tasks.update(selector, { $set: valuesObj }, function (error, result) {
      if (!error && result != 0) {
        if (Meteor.userCan("manageTasks") && status == "open")
          Notification.send("openTask", id);
      }
    });
  },
  "updateTaskStatus": function (id, status) {
    switch (status) {
      case "open":
        if (Meteor.userCan("manageTasks")) {
          Tasks.update(id, { $set: { status: status, ratings: {} } });
        } else {
          Tasks.update({ _id: id, createdBy: Meteor.userId(), status: { $in: ["assigned", "done"] } }, 
          { $set: { status: status, ratings: {} } })
        }
        break;
      case "assigned":
        if (Meteor.userCan("manageTasks")) {
          Tasks.update(id, { $set: { status: status, ratings: {} } });
        } else {
          Tasks.update({ _id: id, createdBy: Meteor.userId(), status: { $in: ["open", "done"] } }, 
          { $set: { status: status, ratings: {} } });
        }
        break;
      case "done":
        if (Meteor.userCan("manageTasks")) {
          Tasks.update(id, { $set: { status: status, ratings: {}, closedAt: new Date() } });
        } else {
          Tasks.update({ _id: id, createdBy: Meteor.userId(), status: { $in: ["open", "assigned"] } }, 
          { $set: { status: status, ratings: {}, closedAt: new Date() } });
        }
        break;
      case "rejected":
        if (Meteor.userCan("manageTasks")) {
          Tasks.update(id, { $set: { status: status, ratings: {} } });
        }
        break;

      default:
        break;
    }
  },
  "deleteTask": function (id) {
    var selector = { _id: id, createdBy: Meteor.userId() };
    if (Meteor.userCan("manageTasks")) {
      selector = { _id: id }
    }

    Meteor.roles.remove(id);
    Meteor.users.update({ roles: id }, {
      $pull: {
        roles: id
      }
    });

  },
  "volunteerForTask": function (id) {
    Meteor.checkUserCan("volunteerForTask");
    Tasks.update({
      _id: id
    }, {
        $addToSet: { volunteers: Meteor.userId() }
      });
  },
  "unvolunteerForTask": function (id) {
    Meteor.checkUserCan("volunteerForTask");
    Tasks.update({
      _id: id
    }, {
        $pull: { volunteers: Meteor.userId() }
      });
  },
  "approveVolunteer": function (taskId, volunteerId, status) {
    var selector = {
      _id: taskId,
      volunteers: volunteerId
    };
    var updateMethod;
    if (status) {
      updateMethod = { $addToSet: { approvedVolunteers: volunteerId } };
    } else {
      updateMethod = { $pull: { approvedVolunteers: volunteerId } };
    }

    if (!Meteor.userCan("manageTasks")) {
      selector.createdBy = Meteor.userId();
    }
    Tasks.update(selector, updateMethod, function (error, result) {
      if (!error && result != 0) {
        if (status)
          Notification.sendToUser(volunteerId, taskId, "approveVolunteer");
        else
          Notification.sendToUser(volunteerId, taskId, "disapproveVolunteer");
      }
    });
  },
  "rateVolunteer": function (taskId, userId, rating) {
    //check validity
    if (Number(rating) > 0 && Number(rating) <= 5) {
      //save rating
      var key = "ratings." + userId;
      var updateObject = {};
      updateObject[key] = rating;
      Tasks.update({
        _id: taskId,
        createdBy: Meteor.userId(),
        status: "done",
        volunteers: userId
      }, { $set: updateObject });
      //add to 5 series, update every 5 rating
    }
  },
  "rateRequester": function (taskId, rating) {
    //check validity
    if (Number(rating) > 0 && Number(rating) <= 5) {
      //save rating
      var key = "requesterRatings." + Meteor.userId();
      var updateObject = {};
      updateObject[key] = rating;
      Tasks.update({
        _id: taskId,
        status: "done",
        volunteers: Meteor.userId(),
        closedAt:{$gte:moment().subtract(1, 'weeks').toDate()}
      }, { $set: updateObject });
      //add to 5 series, update every 5 rating
    }
  }
});