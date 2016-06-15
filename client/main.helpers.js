/**
 * Returns users language
 * @returns {string} language short string of user
 */
getUserLanguage = function() {
    return "tr";
}

Template.registerHelper('isActive', function(route) {
  return Router.current().route.getName() === route ? "active" : "";
});

Template.registerHelper('equals', function(arg1, arg2) {
  return arg1 === arg2;
});