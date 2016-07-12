Tasks = new Mongo.Collection("tasks");
Tags = new Mongo.Collection("tags");
Notifications = new Mongo.Collection("notifications");
Meteor.users._transform = function (user) {
    var rating;
    if (user.totalRating)
        rating = user.totalRating / user.numberOfRating;
    return _.extend(user, { rating: rating });
}