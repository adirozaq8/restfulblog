var express = require('express'),
methodOverride = require('method-override'),
bodyParser = require('body-parser'),
expressSanitizer = require('express-sanitizer'),
app = express(),
mongoose = require('mongoose');

// APP CONFIG
var url = process.env.DATABASEURL || 'mongodb://localhost:27017/restful_blog_app';

mongoose.connect(url, {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: "Car",
//   image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
//   body: "A great Ferrari car"
// }, function(err, car){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(car);
//   }
// })

// RESTFUL ROUTES
app.get('/', function(req, res){
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  })
});

// NEW ROUTE
app.get('/blogs/new', function(req, res){
  res.render('new');
})

// CREATE ROUTE
app.post('/blogs', function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  // Create post
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render('new');
    } else {
      // then redirect
      res.redirect('/blogs');
    }
  })
})

// SHOW ROUTE
app.get('/blogs/:id', function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: foundBlog});
    }
  })
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  })
})

// UPDATE ROUTE
app.put('/blogs/:id', function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  // Update post
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  })
})

// DELETE ROUTE
app.delete('/blogs/:id', function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  })
})

var PORT = process.env.PORT || 8080;
app.listen(PORT, process.env.IP, function(){
  console.log("SERVER STARTED!");
});
