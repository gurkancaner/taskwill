var PUBLIC_ROUTES = ['login', 'register', 'accessDenied', 'notFound'];
ApplicationController = RouteController.extend({
  layoutTemplate: 'master',
  onBeforeAction: function () {
    var self = this;

    

    var name = self.route.getName();
    if (PUBLIC_ROUTES.indexOf(name) != -1) {
      self.layout('masterPublic');
      self.next();
    } else {
      if (Meteor.userId() === null) {
        Router.go('login');
      } else if (Meteor.user()) {
        if (self.route.options && self.route.options.permission
          && !Meteor.userCan(self.route.options.permission)) {
          this.render('accessDenied');
          this.stop();
        } else {
          self.next();
        }
      }

    }
  }
});
