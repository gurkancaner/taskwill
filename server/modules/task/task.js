/**
 * Publish the users
 */
Meteor.publish('tasks', function () {
  return Tasks.find();
});

Meteor.methods({
  //creates or updates role
  "createTask": function (title, description, hours, dueDate, tags) {
    Meteor.checkUserCan("createTask");
    Tasks.insert({
      title: title,
      description: description,
      hours: hours,
      dueDate: dueDate,
      createdBy: Meteor.userId(),
      createdAt: new Date(),
      tags: tags
    });
  },
  "updateTask": function (id, title, description, hours, dueDate, tags) {
    var selector = { _id: id, createdBy: Meteor.userId() };
    if (Meteor.userCan("manageTasks")) {
      selector = { _id: id }
    }
    Tasks.update(selector, {
      title: title,
      description: description,
      hours: hours,
      dueDate: dueDate,
      updatedBy: Meteor.userId(),
      updatedAt: new Date(),
      tags: tags
    });
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