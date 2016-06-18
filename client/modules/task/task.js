var audio;
Template.tasks.onRendered(function () {
  $('.modal-trigger').leanModal();
  $('textarea').characterCounter();
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
  audio = document.getElementById("audio");
});

Template.tasks.helpers({
  Tasks: function () {
    return Tasks.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },
  volunteerStatus: function (volunteers) {
    if (volunteers && Meteor.userId() && volunteers.indexOf(Meteor.userId()) !== -1)
      return "favorite";
    else
      return "favorite_border";
  }
});

Template.tasks.events({
  "submit #add-task-form": function (event, target) {
    event.preventDefault();
    var id = target.find("#id").value;
    var title = target.find("#title").value;
    var hours = target.find("#hours").value;
    var description = target.find("#description").value;
    var duedate = target.find("#duedate").value;
    if (id) {
      Meteor.call("updateTask", id, title, description, hours, duedate, function (error, result) {
        if (error)
          console.log(error);
      });
    } else {
      Meteor.call("createTask", title, description, hours, duedate, function (error, result) {
        if (error)
          console.log(error);
      });
    }

    //clear form
    $('#add-task #permissions').val("");
    $('#add-task #title').val("");
    $('#add-task #hours').val("");
    $('#add-task #description').val("");
    $('#add-task #duedate').val("");
  },
  'click .manage-content': function (event, target) {
    $('#add-task #id').val(this._id);
    $('#add-task #title').val(this.title);
    $('#add-task #duedate').val(this.dueDate);
    $('#add-task #description').val(this.description);
    $('#add-task #hours').val(this.hours);
    $('#add-task').openModal();
  },
  'click #view-task-button': function (event, target) {
    $('#task-view #title').html(this.title);
    $('#task-view #duedate').html(this.dueDate);
    $('#task-view #description').html(this.description);
    $('#task-view #hours').html(this.hours);
    $('#task-view #volunteer-button').data("id", this._id)
    $('#task-view #unvolunteer-button').data("id", this._id)
    if (this.volunteers && Meteor.userId() && this.volunteers.indexOf(Meteor.userId()) !== -1) {
      $('#task-view #volunteer-button').hide();
      $('#task-view #unvolunteer-button').show();
    } else {
      $('#task-view #unvolunteer-button').hide();
      $('#task-view #volunteer-button').show();
    }

  },
  'click #volunteer-button': function (event, target) {
    audio.play();
    //toggle volunteer status
    $(event.target).hide();
    $('#task-view #unvolunteer-button').show();
    Meteor.call("volunteerForTask", $(event.target).data("id"), function (error, result) {
      if (error)
        console.log(error);
    });
    return false;
  },
  'click #unvolunteer-button': function (event, target) {
    audio.play();
    //toggle volunteer status
    $(event.target).hide();
    $('#task-view #volunteer-button').show();
    Meteor.call("unvolunteerForTask", $(event.target).data("id"), function (error, result) {
      if (error)
        console.log(error);
    });
    return false;
  },
  'click #favorite': function (event, target) {
    audio.play();
    Meteor.call("unvolunteerForTask", this._id, function (error, result) {
      if (error)
        console.log(error);
      else
        Materialize.toast('Gönüllü olmaktan vazgeçtiniz :(', 4000)
    });
    return false;
  },
  'click #favorite_border': function (event, target) {
    audio.play();
    Meteor.call("volunteerForTask", this._id, function (error, result) {
      if (error)
        console.log(error);
      else
        Materialize.toast('Gönüllü oldunuz :)', 4000)
    });
    return false;
  },

});