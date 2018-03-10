const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const tests = require('./routes/tests')
const keys = require('./config/keys')
const db = require('mongoskin').db(keys.db.URI, { w: 0 });
db.bind('event');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/test', tests)

app.get('/data', function(req, res) {
    db.event.find().toArray(function(err, data) {
        //set id property for all records
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;

        //output response
        res.send(data);
    });
});


app.post('/data', function(req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.id;
    var tid = sid;

    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];

    update_response = (err, result) => {
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type", "application/json");
        res.send({ action: mode, sid: sid, tid: tid });
    }

    if (mode == "updated")
        db.event.updateById(sid, data, update_response);
    else if (mode == "inserted")
        db.event.insert(data, update_response);
    else if (mode == "deleted")
        db.event.removeById(sid, update_response);
    else
        res.send("I can't do that");
});

app.listen(3000);