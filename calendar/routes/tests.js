const router = require('express').Router()
const keys = require('../config/keys')
const bodyParser = require('body-parser');
// const User = require('../models/user-model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const db = require('mongoskin').db(keys.db.URI, { w: 0 });
db.bind('event');

router.get('/init', function(req, res) {
    db.event.insert({
        text: "My test event A",
        start_date: new Date(2018, 8, 1),
        end_date: new Date(2018, 8, 5)
    });
    db.event.insert({
        text: "My test event B",
        start_date: new Date(2018, 8, 19),
        end_date: new Date(2018, 8, 24)
    });
    db.event.insert({
        text: "Morning event",
        start_date: new Date(2018, 8, 4, 4, 0),
        end_date: new Date(2018, 8, 4, 14, 0)
    });
    db.event.insert({
        text: "One more test event",
        start_date: new Date(2018, 8, 3),
        end_date: new Date(2018, 8, 8),
        color: "#DD8616"
    });

    res.send("Test events were added to the database")
});
module.exports = router