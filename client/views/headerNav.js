Template.headerNav.onRendered(function() {
  $("#logo-img").attr("src", '/static/logo.png').error(function() {
    $(this).attr("src", "/images/logo.png");
  })
});
Template.headerNav.helpers({
  Notifications: function () {
    return Notifications.find({}, { "sort": { createdAt: -1 } }).map(function (doc) {
      var task = Tasks.findOne(doc.objectId);
      var text = task.title;
      var icon;
      switch (doc.objectType) {
        case "openTask":
          text = TAPi18n.__('a_task_for_you') +': "' + task.title + '"';
          icon = 'mdi-image-panorama-fisheye';
          break;
        case "approveVolunteer":
          text = TAPi18n.__('assigned_to_task', task.title);
          icon = 'mdi-toggle-radio-button-on';
          break;
        case "disapproveVolunteer":
          text = TAPi18n.__('unassigned_from_task', task.title);
          icon = 'mdi-notification-dnd-forwardslash';
          break;

        default:
          break;
      }
      return _.extend(doc, {
        text: text,
        icon: icon
      })
    });
  },
  NotificationCount: function () {
    return Notifications.find({ read: false }).count();
  },
  getNotificationStatus: function (read) {
    return read ? "grey-text" : "";
  },
  getFlag: function () {
    switch (Session.get("userLanguage")) {
      case "tr":
        return "Turkey";
      case "en":
        return "United-States";
      default:
        break;
    }
  },
  rating: function(){
    return Meteor.user().rating;
  },
  getLogo: function(){
    return
  }
});

Template.headerNav.events({
  'click .change-language-button': function (event, template) {
    var lang = $(event.currentTarget).data("lang");
    Meteor.call("updateUserSettings", "profile.language", lang, function (error, result) {
      if (error) {
        console.log("error", error);
      } else {
        Session.set("userLanguage", lang);
        moment.locale(lang);
        TAPi18n.setLanguage(lang);
      }
    });
  },
  'click #mark-as-read': function (event, template) {
    Meteor.call("markNotificationsAsRead", function (error, result) {
      if (error) {
        console.log("error", error);
      }
    });
  }
});