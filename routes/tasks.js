'use strict';

var express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    mongo = require('mongojs'),
    db = mongo('mongodb://antoniadis:2a4b6c!8@ds161069.mlab.com:61069/car_brand', ['tasks', 'tk103'])

// As with any middleware it is quintessential to call next()
// if the user is authenticated
,
    auth = function auth(req, res, next) {
    console.log('tasks req auth ', req && req.user ? req.user : 'req.user undefined');
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) return next();
    // if they aren't redirect them to the home page
    res.json({ message: 'You have to sign in ..' });
};

/**
 * https Router Gets
 */
router.get('/tasks', tasks); // Get All Tasks
router.get('/task/:id', singletask); // Get Single task

router.get('/init/:id', auth, initializeUnit); // Send Begin SMS to the device

/**
 * https Router Posts
 */
router.post('/task', auth, savetask); // Save task

/**
 * https Router Delete
 */
router.delete('/task/:id', auth, deletetask); // Delete task

/**
 * https Router Put
 */
router.put('/task/:id', auth, updatetask); // Update task

router.put('/resetpass/:id', auth, resetpassword); // update password of the device


// ---------- https Functions ToDo ----------
function tasks(req, res, next) {

    db.tasks.find(function (err, tasks) {
        if (err) res.send(err);
        res.json(tasks);
    });
}

function singletask(req, res, next) {

    db.tasks.findOne({ _id: mongo.ObjectId(req.params.id) }, function (err, task) {
        if (err) res.send(err);
        res.json(task);
    });
}

function savetask(req, res, next) {

    var task = req.body;

    if (!task.title || !(task.isDone + '')) {
        res.status(400);
        res.json({
            "error": "Bad data"
        });
    } else {
        db.tasks.save(task, function (err, tasks) {
            if (err) res.send(err);
            res.json(tasks);
        });
    }
}

function deletetask(req, res, next) {

    db.tasks.remove({ _id: mongo.ObjectId(req.params.id) }, function (err, tasks) {
        if (err) res.send(err);
        res.json(tasks);
    });
}

function updatetask(req, res, next) {

    var task = req.body,
        updTask = {};

    if (task.isDone) updTask.isDone = task.isDone;
    if (task.title) updTask.title = task.title;
    if (!updTask) {
        res.status(400);
        res.json({ "error": "Bad data" });
    } else {
        db.tasks.update({ _id: mongo.ObjectId(req.params.id) }, updTask, {}, function (err, tasks) {
            if (err) res.send(err);
            res.json(tasks);
        });
    }
}

function initializeUnit(req, res) {

    var defaultpass = '123456';
    tk103 = { oldpass: defaultpass };
    commandString = 'begin' + defaultpass; // default password

    // send command to tk03 and callback

    // if password changed
    db.tk103.save({ _id: mongo.ObjectId(req.params.id) }, tk103, {}, function (err, tk103) {
        if (err) res.send(err);
        res.json('begin ok! device is ready to used..');
    });
}

function resetpassword(req, res) {

    // find old password
    db.tk103.findOne({ _id: mongo.ObjectId(req.params.id) }, function (err, tk103) {
        if (err) res.send(err);

        // if fetched password send command to device tk03
        var newpass = req.body,
            oldpass = tk103.oldpass,
            commandString = 'password' + oldpass + ' ' + newpass; // change password

        // send command to tk03 and callback

        // if success update db.tk03 password
        tk103.oldpass = newpass;

        db.tk103.update({ _id: mongo.ObjectId(req.params.id) }, tk103, {}, function (err, tk103) {
            if (err) res.send(err);
            res.json('begin ok! device is ready to used..');
        });
    });
}

function authorization(res, req) {

    // if password fetched and send command to device tk03
    var authorizednumber = req.body,
        pass = tk103.oldpass,
        commandString = 'admin' + pass + ' ' + authorizednumber; // change password with +cod

    // send command to tk03 and callback
}

// function singleLocation(params) {

// }

function autotrack(res, req, next) {

    // if password fetched and send command to device tk03
    var type = req.body // type: cancelation or limit-unlimited
    ,
        pass = tk103.oldpass,
        commandString = null; // change password with +cod

    // send command to tk03 and callback

    // if password fetched and send command to device tk03
    if (type == 'cancel') commandString = 'notn' + pass; // change password with +cod
    else if (type == 'unlimited') commandString = 't' + m + s_double_precesion + 's' + '***n' + pass;else commandString = 't' + m + s_double_precesion + 's' + times_third_precesion + 'n' + pass;
}

function voiceMonitor(res, req) {

    // if password fetched and send command to device tk03
    var mode = req.body // mode = tracker mode or monitor
    ,
        pass = tk103.oldpass,
        commandString = mode + pass;
    // send command to tk03 and callback res json
}

module.exports = router;