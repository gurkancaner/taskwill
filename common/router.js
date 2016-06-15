Router.configure({
  // we use the  master template to define the layout for the entire app
  layoutTemplate: 'masterPublic',

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

  controller: 'ApplicationController'

});


//auth
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

//story
Router.route('/', {
  name: 'home',
  template: 'home'
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
