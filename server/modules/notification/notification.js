Meteor.publish('notifications', function () {
    if (this.userId) {
        return Notifications.find({
            userId: this.userId
        });
    }
});
Meteor.methods({
    "markNotificationsAsRead": function () {
        Notifications.update({
            userId: Meteor.userId()
        },
            {
                $set: {
                    read: true
                }
            });
    }
});



/**
 * userId
 * actor
 * objectId
 * objectType
 * isRead
 * createdAt
 */
Notification = {
    send: function (type, id) {
        switch (type) {
            case "openTask":
                var task = Tasks.findOne(id);
                var filter = { "level": { $gte: task.level } };
                if (task.location)
                    filter["profile.location"] = task.location;
                if (task.tags)
                    filter["profile.tags"] = { '$in': task.tags };
                var userIdList = Meteor.users.find(filter);
                console.log("filter", filter);
                userIdList.forEach(function (user) {
                    Notification.sendToUser(user._id, id, type);
                }, this);
                break;

            default:
                break;
        }
        return
    },
    sendToUser: function (userId, objectId, objectType) {
        console.log("sendToUser", userId, objectId, objectType);
        Notifications.upsert({//if there is a notification with same objectId, override it
            objectId: objectId
        }, {
                userId: userId,
                actor: Meteor.userId(),
                objectId: objectId,
                objectType: objectType,
                read: false,
                createdAt: new Date()
            });
        var checkPoint = Math.floor((1 + Math.random()) * 10);
        if(checkPoint == 5|| true){//delete last more than 10 notification
            //find last 10 notifications
            //var ids= Notifications.find({},{_id:1, sort:{createdAt:-1}, skip:2}).map(function(doc){return doc._id});
            //delete all but last 10
            //Notifications.remove({$nin:{_id:ids}},{sort:{createdAt:-1}, skip:2});
        }     

    }
}