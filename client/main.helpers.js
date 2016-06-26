/**
 * Returns users language
 * @returns {string} language short string of user
 */
getUserLanguage = function() {
  if (Session.get("userLanguage")) { //check session object
    return Session.get("userLanguage");
  }
  if (Meteor.user() && Meteor.user().profile.language != undefined) { //check db
    Session.set("userLanguage", Meteor.user().profile.language);
    return Meteor.user().profile.language;
  } else { //check browser
    var localeFromBrowser = window.navigator.userLanguage || window.navigator.language;
    var locale = 'en';
    if (localeFromBrowser.match(/tr/)) {
      locale = 'tr';
    }
    Session.set("userLanguage", locale);
    Meteor.call("updateUserSettings", "profile.language", locale, function(error, result) {
      if (error) {
        console.log("error", error);
      }
    });
    return locale;
  }
};

Template.registerHelper('isActive', function (route) {
  return Router.current().route.getName().indexOf(route) !== -1 ? "active" : "";
});

Template.registerHelper('equals', function (arg1, arg2) {
  return arg1 === arg2;
});