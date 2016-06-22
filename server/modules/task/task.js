/**
 * Publish the users
 */
Meteor.publish('tasks', function () {
  var level = 0;
  if(this.userId){
    if(Role.userCan("manageTasks", this.userId)){
      return Tasks.find();   
    }else{
      var user = Meteor.users.findOne(this.userId);
      if(user)
        level = user.level;
    }
  }
  return Tasks.find({level:{$lte: level}});
});

Meteor.methods({
  //creates or updates role
  "createTask": function (title, description, hours, dueDate, tags, level) {
    Meteor.checkUserCan("createTask");
    if (Meteor.userCan("manageTasks")) {
      if(!level)
        level = 0;
    }else
      level = 0;
    
    Tasks.insert({
      title: title,
      description: description,
      hours: hours,
      dueDate: dueDate,
      createdBy: Meteor.userId(),
      createdAt: new Date(),
      tags: tags,
      level:level
    });
  },
  "updateTask": function (id, title, description, hours, dueDate, tags, level) {
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
    }
    Tasks.update(selector, valuesObj);
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