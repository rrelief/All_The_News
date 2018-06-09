// npm packages
var express = require ('express');
var router = express.Router();
var path = require('path');

//require packages that make web scrapping possible
var request = require ('request');
var cheerio = require('cheerio');

//need to require the models for scraped data and comments
var Article = require('../models/Dar.js');
var Comment = require('../models/Comment.js');

//main route
router.get('/', function(req,res){
    res.redirect('/articles');
});

//need to make a GET request to scrape TechCrunch Website for new articles
router.get('/scrape', function(req, res) {
    //step 1, grab the body of the html with a request from techcrunch
    request('https://techcrunch.com/', function(error, response, html) {
        //Step 2, load the body of the html into Cheerio and save it as a variable ($) so I can reference it later
        var $ = cheerio.load(html);
        var titlesArray =[];
        //Step 3, time to write code that will grab all latest articles
        $('post-block__title__link').each(function(i, element) {
            //Step 4, save results into an empty results object
            var result = {};

            //Step 4, save text and href of article as properties of the result object
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            //need code to ensure that no empty tites or links are sent to mongodb
            if(result.title !=="" && result.link !==""){
                //this line of code will check for duplicates
                if(titlesArray.indexOf(result.title) == -1){

                    // Step 5, push the saved title to the array
                    titlesArray.push(result.title);

                    //Step 6, check to see if the article is already there
                    Article.count({title: result.title}, function(err, test){
                        // if 0, then unique entry so save
                        if(test == 0){
                            //step 7, if new entry create a new object and save object entry to mongodb
                            var entry = new Article (result);
                            entry.save(function(err,doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                    });
                }
                else {
                    console.log('This article already exists in the db!');
                }
            }
            else {
                console.log('This article was not saved because it is missing data.');
            }
        });
        //Finally, after scraping redirect user back to index
        res.redirect('/');
    });
});

//make a Get request that will grab every article and populate the DOM
router.get('/articles', function(req, res) {
    //allows newer articles to be on top
    Article.find().sort({_id: -1})
        //send to handlebars
        .exec(function(err, doc) {
            if(err){
                console.log(err);
            } else{
                var artcl = {article: doc};
                res.render('index', artcl);
            }
    });
});

// This will get the articles we scraped from the mongoDB in JSON
router.get('/articles-json', function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

//clear all articles for testing purposes
router.get('/clearAll', function(req, res) {
    Article.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('removed all articles');
        }

    });
    res.redirect('/articles-json');
});

router.get('/readArticle/:id', function(req, res){
  var articleId = req.params.id;
  var hbsObj = {
    article: [],
    body: []
  };

    // //find the article at the id
    Article.findOne({ _id: articleId })
      .populate('comment')
      .exec(function(err, doc){
      if(err){
        console.log('Error: ' + err);
      } else {
        hbsObj.article = doc;
        var link = doc.link;
        //grab article from link
        request(link, function(error, response, html) {
          var $ = cheerio.load(html);

          $('.l-col__main').each(function(i, element){
            hbsObj.body = $(this).children('.c-entry-content').children('p').text();
            //send article body and comments to article.handlbars through hbObj
            res.render('article', hbsObj);
            //prevents loop through so it doesn't return an empty hbsObj.body
            return false;
          });
        });
      }

    });
});

// Create a new comment
router.post('/comment/:id', function(req, res) {
  var user = req.body.name;
  var content = req.body.comment;
  var articleId = req.params.id;

  //submitted form
  var commentObj = {
    name: user,
    body: content
  };
 
  //using the Comment model, create a new comment
  var newComment = new Comment(commentObj);

  newComment.save(function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log(doc._id)
          console.log(articleId)
          Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {'comment':doc._id}}, {new: true})
            //execute everything
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/readArticle/' + articleId);
                }
            });
        }
  });
});

module.exports = router;
