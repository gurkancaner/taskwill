Template.users.helpers({
  Users: function () {
    var filter = {}
    if (Router.current().params.role) {
      filter = { roles: Router.current().params.role }
    } else if (Router.current().params.level) {
      filter = { level: Router.current().params.level }
    }
    return Meteor.users.find(filter, {
      sort: {
        "profile.name": 1
      }
    });
  },
  Roles: function () {
    return Meteor.roles.find({}, {
      sort: {
        name: 1
      }
    });
  },
  Levels: function () {
    return _.range(1, +Meteor.user().level + 1);
  },
  getUserRole: function (roles, userRoleIds) {
    var result = "";
    if (userRoleIds) {
      for (var i = 0; i < userRoleIds.length; i++) {
        result += _.where(roles.fetch(), { _id: userRoleIds[i] })[0].name + ", "
      }
    }
    if (result)
      return result.slice(0, -2);
    else return "-"
  },
  hasSmallerLevel: function(level){
    return level <= Meteor.user().level;
  }

});

Template.users.events({
  "submit #edit-user-form": function (event, target) {
    event.preventDefault();
    var id = target.find("#id").value;
    var name = target.find("#name").value;
    var roles = $(target.find("#roles")).val();
    var level = $(target.find("#level")).val();
    var oldRoles = Meteor.users.findOne(id).roles;
    if(!_.isEqual(oldRoles.sort(), roles.sort())){
      Meteor.call("setUserRoles", id, roles, function (error, result) {
        if (error)
          console.log(error);
      });
    }

    Meteor.call("updateUser", id, name, level, function (error, result) {
        if (error)
          console.log(error);
      });
    
  },
  "click .user-edit-button": function (event, target) {
    var tmpRoles = [];
    if (this.roles)
      tmpRoles = this.roles;
    $('#edit-user #roles').val(tmpRoles);//set roles
    $('#edit-user #level').val(this.level);
    $('select').material_select();//update select box
    $('#edit-user #id').val(this._id);
    $('#edit-user #name').val(this.profile.name);
    $('#edit-user').openModal();
  }
});