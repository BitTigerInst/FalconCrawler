var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect(database.remoteUrl, function (err) {
    if (err) {
        console.log('Failed to connect to the database.');
        console.log(err);
    } else {
        console.log('Connected to the database.');
    }
});


// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// pull information from html in POST
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

// ----- define model
var Todo = mongoose.model('Todo', {
    text: String
});

// ----- define routes

// get all todos
app.get('/api/todos', function (req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function (err, todos) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            console.log(err);
            res.send(err);
        }
        console.log(todos);
        res.json(todos); // return all todos in JSON format
    });
});

// create Todo and send back all todos after creation
app.post('/api/todos', function (req, res) {
    // create a Todo, information comes from AJAX request from Angular
    Todo.create({
        text: req.body.text,
        done: false
    }, function (err, todo) {
        if (err) {
            res.send(err);
        }
        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });

});

// delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
});

// get the index.html
app.get('*', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);