Template.taskAction.helpers({
    status: function () {
        return safeGet(Tasks.findOne(Session.get("selectedTaskId")), "status");
    },
    rating: function () {
        var rating = 0.001;
        var ratings = safeGet(Tasks.findOne(Session.get("selectedTaskId")), "requesterRatings");
        if (ratings && ratings[Meteor.userId()] !== undefined)
            rating = ratings[Meteor.userId()];
        return rating;
    },
    isRateble: function(){
        var closedAt = safeGet(Tasks.findOne(Session.get("selectedTaskId")), "closedAt");
        return closedAt >= moment().subtract(1, 'weeks').toDate(); 
    }
});

Template.taskAction.events({
    "click .rating-bar": function (event, target) {
        var rating = $(event.currentTarget).data('userrating');
        var taskId = Session.get("selectedTaskId");
        Meteor.call("rateRequester", taskId, rating, function (error, result) {
            if (error)
                console.log(error);
        });
    }
});