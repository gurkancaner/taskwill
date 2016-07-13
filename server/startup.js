Meteor.startup(function () {
    SyncedCron.start();
    Accounts.loginServiceConfiguration.remove({
        service: 'twitter'
    });
    console.log(Meteor.settings);
    Accounts.loginServiceConfiguration.insert({
        service: 'twitter',
        consumerKey: Meteor.settings.twitter.consumerKey,
        secret: Meteor.settings.twitter.secret
    });
});

