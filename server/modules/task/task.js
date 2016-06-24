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
  "createTask": function (title, description, hours, dueDate, tags, level) {
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
      status: "waiting"//waiting, open, assigned, done, rejected
    });
  },
  "updateTask": function (id, title, description, hours, dueDate, tags, level, status) {
    var selector = { _id: id, createdBy: Meteor.userId() };
    var valuesObj = {
      title: title,
      description: description,
      hours: hours,
      dueDate: dueDate,
      updatedBy: Meteor.userId(),
      updatedAt: new Date(),
      tags: tags,
    };
    if (Meteor.userCan("manageTasks")) {
      selector = { _id: id }
      valuesObj.level = Number(level);
      if(status)
        valuesObj.status = status;
    }
    Tasks.update(selector, {$set:valuesObj});
  },
  "updateTaskStatus": function (id, status) {
    if(status == "rejected"){
      if (Meteor.userCan("manageTasks")) {
        Tasks.update(id, {$set:{status:"rejected"}});
      }
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
  }
});