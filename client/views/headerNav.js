Template.headerNav.helpers({
  Notifications: function () {
    return Notifications.find().map(function (doc) {
      var task = Tasks.findOne(doc.objectId);
      var text = task.title;
      return _.extend(doc, {
        text: text
      })
    });
  },
  NotificationCount: function () {
    return Notifications.find({read:false}).count();
  },
  getNotificationIcon: function () {
    return "mdi-action-stars";
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