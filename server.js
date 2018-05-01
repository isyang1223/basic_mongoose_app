// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;


var UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true, minlength: 2 },
    last_name: { type: String, required: true, maxlength: 20 },
    age: { type: Number, min: 1, max: 150 },
    email: { type: String, required: true }}, { timestamps: true });


// var UserSchema = new mongoose.Schema({
//     name: String,
//     age: Number
// })
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'



// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    User.find({}, function (err, users) {
        if(err){
            console.log('error')
        }
        else {
            console.log(users)
            res.render('index', {users: users});
        }
    })
})
// Add User Request 
app.post('/users', function (req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var user = new User();
    user.first_name = req.body.first_name
    user.last_name = req.body.last_name
    user.age = req.body.age
    user.email = req.body.email
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function (err) {
        // if there is an error console.log that something went wrong!
        if (err) {
            User.find({}, function (err, users) {
                if (err) {
                    console.log('error')
                }
                else {
                    
                    res.render('index', { users: users, errors: user.errors  });
                }
            })
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a user!');
            res.redirect('/');
        }
    })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function () {
    console.log("listening on port 8000");
})