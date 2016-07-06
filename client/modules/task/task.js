var audio;
Template.tasks.onRendered(function () {
  $('.modal-trigger').leanModal();
  $('textarea').characterCounter();
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
  $('select').material_select();
  audio = document.getElementById("audio");
});

Template.tasks.helpers({
  Tasks: function () {
    var filter = { status: "open" };
    if (Router.current().params.status) {
      filter.status = Router.current().params.status;
    } else if (Router.current().params.level) {
      filter.level = Router.current().params.level;
    }
    if (filter.status == "waiting")
      Session.set("title", "Incoming Requests");
    else if (filter.status == "open")
      Session.set("title", "Waiting Tasks");

    switch (Router.current().params.type) {
      case "tasks":
        filter = { volunteers: Meteor.userId() };
        Session.set("title", "My Tasks");
        break;
      case "requests":
        filter = { createdBy: Meteor.userId() };
        Session.set("title", "My Requests");
      default:
        break;
    }
    return Tasks.find(filter, {
      sort: {
        createdAt: -1
      }
    }).map(function (doc) {
      if (doc.tags) {
        var tags = doc.tags.map(function (tagId) {
          return Tags.findOne(tagId);
        });
        return _.extend(doc, {
          tags: tags
        });
      }
      return doc;
    });
  },
  volunteerStatus: function (volunteers) {
    if (volunteers && Meteor.userId() && volunteers.indexOf(Meteor.userId()) !== -1)
      return "favorite";
    else
      return "favorite_border";
  },
  Tags: function () {
    return Tags.find({}, {
      sort: {
        name: 1
      }
    });
  },
  Levels: function () {
    return _.range(0, +Meteor.user().level + 1);
  },
  isViewingOpenTasks: function () {
    return Router.current().params.status == undefined || Router.current().params.status == "open";
  },
  getTaskSubtitle: function () {
    return Session.get("title");
  },
  getTaskIconClass: function (task) {
    switch (task.status) {
      case "open":
        if (Session.get("title") == "My Requests" && task.volunteers) {
          if (task.volunteers.length > 9)
            return "mdi-image-filter-9-plus  blue-text";
          return "mdi-image-filter-" + task.volunteers.length + "  blue-text";
        }
        return "mdi-image-panorama-fisheye amber-text";
      case "waiting":
        return "mdi-content-mail grey-text";
      case "rejected":
        return "mdi-content-block black-text";
      case "assigned":
        return "mdi-toggle-radio-button-on blue-text";
      case "done":
        return "mdi-toggle-check-box green-text";
      default:
        break;
    }
  }

});

Template.tasks.events({
  "click  :input.submit ": function (event, target) {
    event.preventDefault();
    var id = $("#add-task #id").val();
    var title = $("#add-task #title").val();
    var hours = $("#add-task #hours").val();
    var description = $("#add-task #description").val();
    var duedate = $("#add-task #duedate").val();
    var tags = $("#add-task #tags").val();
    var level = $("#add-task #level").val();
    var status = $(event.target).prop("id");
    var location = $('#add-task #is-local').prop("checked") ? $('#add-task #location').val() : "";
    if (id) {
      Meteor.call("updateTask", id, title, description, hours, duedate, tags, level, status, location, function (error, result) {
        if (error)
          console.log(error);
      });
    } else {
      Meteor.call("createTask", title, description, hours, duedate, tags, level, location, function (error, result) {
        if (error)
          console.log(error);
      });
    }

    //clear form
    $('#add-task .elem').val("");
    $('select').material_select();
    $('#add-task #is-local').prop("checked", false);
    $('#location-wrapper').hide();
  },
  'click .task-add': function (event, target) {
    $('#add-task .elem').val("");
    $('#add-task #is-local').prop("checked", false);
    $('#location-wrapper').hide();
    $('select').material_select();
  },
  'click #is-local': function (event, target) {
    $('#location-wrapper').toggle($(event.target).prop("checked"))
  },
  'click .manage-content': function (event, target) {
    $('#add-task #id').val(this._id);
    $('#add-task #title').val(this.title);
    $('#add-task #duedate').val(this.dueDate);
    $('#add-task #description').val(this.description);
    $('#add-task #hours').val(this.hours);
    if (this.tags)
      $('#add-task #tags').val(_.pluck(this.tags, "_id"));
    else
      $('#add-task #tags').val("");
    $('#add-task #level').val(this.level);
    $('#add-task #is-local').prop("checked", this.location);
    $('#location-wrapper').toggle(Boolean(this.location));
    $('#add-task #location').val(this.location);

    $('select').material_select();//update select box
    $('#add-task').openModal();
  },
  'click .view-task-button': function (event, target) {
    Session.set("selectedTaskId", this._id);
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
    $("#task-view").openModal();
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
        Materialize.toast('Gönüllü oldunuz :)', 4000);
    });
    return false;
  },

});