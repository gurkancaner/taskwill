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
    return Notifications.find().count();
  },
  getNotificationIcon: function () {
    return "mdi-action-stars";
  }
});

Template.headerNav.events({
  'click "#translation-dropdown a"': function (event, template) {
    var lang = $(event.target).data("lang");
    Session.set("userLanguage", lang);
    Meteor.call("updateUserSettings", "profile.language", lang, function (error, result) {
      if (error) {
        console.log("error", error);
      }
    });
  }
});