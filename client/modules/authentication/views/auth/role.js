Template.roles.helpers({
  Roles: function() {
    return Meteor.roles.find({}, {
      sort: {
        name: 1
      }
    });
  },
  Permissions: function () {
      return _.map(Role.AuthorizationPermissions, function(val,key){return {name: key, value: val}});
  }
});

Template.roles.events({
  "submit #add-role-form": function(event, target){
    event.preventDefault();
    var id = target.find("#id").value;
    var roleName = target.find("#name").value;
    var permissions = $(target.find("#permissions")).val();
    Meteor.call("createRole", id, roleName, permissions,function(error, result){
      if(error)
        console.log(error);
    });
    //clear form
    $('#add-role #permissions').val("");//set permissions
      $('select').material_select();//update select box
      $('#add-role #name').val("");
      $('#add-role #id').val("");
  },
  "click #role-add-button":function(event, target){
    //clear form
    $('#add-role #permissions').val("");//set permissions
    $('select').material_select();//update select box
    $('#add-role #name').val("");
    $('#add-role #id').val("");
    $('#add-role').openModal();
  },
  "click .role-edit-button":function(event, target){
    if(this.permissions)
      $('#add-role #permissions').val(this.permissions);//set permissions
    $('select').material_select();//update select box
    $('#add-role #name').val(this.name);
    $('#add-role #id').val(this._id);
    $('#add-role').openModal();
  },
  "click .role-delete-button":function(event, target){
    $('#delete-role #role-name').html(this.name);//set permissions
    $('#confirm-role-delete').data("id", this._id);
    $('#delete-role').openModal();
  },
  "click #confirm-role-delete":function(event, target){
    Meteor.call("deleteRole", $('#confirm-role-delete').data("id"),function(error, result){
      if(error)
        console.log(error);
    });
  }

})