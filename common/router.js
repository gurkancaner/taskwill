Router.configure({


  // the notFound template is used for unknown routes and missing lists
  notFoundTemplate: 'notFound',

  // show the loading template whilst the subscriptions below load their data
  loadingTemplate: 'loading',

  yieldRegions: {
    'headerNav': {
      to: 'headerNav'
    },
    'sideNav': {
      to: 'sideNav'
    }

  },

  controller: 'ApplicationController',
  waitOn: function() { return Meteor.subscribe('userRoles');}

});

Router.route('accessDenied');

//----------------auth start--------------
Router.route('login', function() {
  if (Meteor.userId()) {
    Router.go("/");
  } else {
    this.render();
  }
});
Router.route('logout', function() {
  Meteor.logout();
  Router.go("login");
});

Router.route('register', function() {
  if (Meteor.userId()) {
    Router.go("/");
  } else {
    this.render();
  }
});

Router.route('roles',{
    permission:"manageRoles"
});

Router.route('users',{
    permission:"manageUsers"
});
Router.route('users/role/:role',{
    permission:"manageUsers",
    template: "users"
});
Router.route('users/level/:level',{
    permission:"manageUsers",
    template: "users"
});
//--------------auth end--------------

//----------------user start------------
Router.route('user/profile',{
  template:"profile",
  data: function() {
    return Meteor.user();
  }
});
//----------------user end--------------

//----------------task start--------------
Router.route('tasks');
Router.route('tasks/:status',{
    template: "tasks"
});
Router.route('mytasks/:type',{
    template: "tasks"
});

//----------------task end--------------

//----------------settings start--------------
Router.route('tags');
Router.route('settings/application',{
    permission:"changeApplicationSettings",
    template: "applicationSettings",
    title: "Application Settings"
});

//----------------settings end--------------

Router.route('/', {
  name: 'home',
  template: 'tasks'
});
// Router.route('story/add');
// Router.route('story/edit/:_id', {
//   data: function() {
//     return Stories.findOne({
//       _id: this.params._id,
//       user: Meteor.userId()
//     });
//   },
//   template: "storyAdd"
// });
// Router.route('story/:_id', {
//   data: function() {
//     return Stories.findOne({
//       _id: this.params._id,
//     //user: Meteor.userId() //for the time being everybody can see each others story if knows the id
//     });
//   },
//   template: "storyView"
// });
