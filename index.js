var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var gst = require('google-search-trends');

var targetUrl = "http://c.xkcd.com/random/comic/";
var googleTrendUrl = "http://hawttrends.appspot.com/api/terms/";

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  var result = 'My API is UP and RUNNING!';
  console.log("Yo Yo");
  res.send(result);
});

app.get('/xkcd_json', function(req, res){
	request(targetUrl, function(error, response, body){
		if(!error && response.statusCode == 200){
			$ = cheerio.load(body);
			var str = $("#middleContainer").text();
			// console.log(str);

			//Get a random url
			var re = /http:\/\/xkcd\.com\/([0-9]+)\//;
			console.log("Permanent page url : ", str.match(re)[0]);
			var pageUrl = str.match(re)[0];

			// re = /\{\{Title Text: (.*)\}\}/;
			// console.log("Title : ", str.match(re)[0]);
			console.log("Title : ", $("#comic img").attr("title"));
			var title = $("#comic img").attr("title");

			// re = /http:\/\/imgs\.xkcd.com\/(.*)/;
			// console.log("Image url : ", str.match(re)[0]);
			console.log("Image url : ", $("#comic img").attr("src"));
			var imgSrc = $("#comic img").attr("src");

			res.json({
				'page_url': pageUrl,
				'img_url': imgSrc,
				'title': title
			});
		}else{
			res.status(500).jsonp({error : error.toString()});
		}
	});
});

app.get('/xkcd_jsonp', function(req, res){
	request(targetUrl, function(error, response, body){
		if(!error && response.statusCode == 200){
			$ = cheerio.load(body);
			var str = $("#middleContainer").text();
			// console.log(str);

			//Get a random url
			var re = /http:\/\/xkcd\.com\/([0-9]+)\//;
			// console.log("Permanent page url : ", str.match(re)[0]);
			var pageUrl = str.match(re)[0];

			// re = /\{\{Title Text: (.*)\}\}/;
			// console.log("Title : ", str.match(re)[0]);
			// console.log("Title : ", $("#comic img").attr("title"));
			var title = $("#comic img").attr("title");

			// re = /http:\/\/imgs\.xkcd.com\/(.*)/;
			// console.log("Image url : ", str.match(re)[0]);
			// console.log("Image url : ", $("#comic img").attr("src"));
			var imgSrc = $("#comic img").attr("src");
			res.jsonp({
				page_url: pageUrl,
				img_url: imgSrc,
				title: title
			});
		}else{
			res.status(500).jsonp({error : error.toString()});
		}
	});
});

app.get('/google_trends', function(req, res){
	gst.result(function(err, response){
		if(!err){
			res.jsonp(response);
		} else {
			res.status(500).jsonp({error: error.toString()});
		}
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});