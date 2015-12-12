/*
var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key:         'pyS7oRP9dTqarSV2a6FBOGYwd'
  , consumer_secret:      'krR4rCNy8cJecVDxZcnAtTQVBZEdCs2R9eSPtckBvoKSUVu9cD'
  , access_token:         '2742674484-1qIamhT09a4vzW6QbtVgG5hGTQmf6nTytYK9oRv'
  , access_token_secret:  'C8Gn56kOb7mCx1Bp8PAeEi5sXKHVmuKJziQ32YDvb4Vxc'
})

twit.get('/statuses/show/2742674484.json', {include_entities:true}, function(data) {
    console.log(util.inspect(data));
});

//twit.get('user_timeline.json', {include_entities:true, screen_name:'twitterapi', count:2}, function(data) {
//    console.log(util.inspect(data));
//});
*/

var http = require("http");
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(req, res) {
  
  if(req.url.indexOf("?") === -1){
    serveFile(req, res);
  } else {
    var name =  require('url').parse(req.url, true).query.name; 
    var count = require('url').parse(req.url, true).query.count; 
    console.log('got request for ',name, ' for ', count, ' tweets');
    name = name || "twitterapi";
    count = count || 10;
    getTweets(name, count, function(eflag,data,result){
      res.setHeader('Access-Control-Allow-Origin', '*');
      if(eflag){
        console.log(eflag.toString());
        res.end('error');
      }
      else
        res.end(data);
    });
  }
}).listen(process.argv[2] || 8000);

function getTweets(name, count, callback){
var OAuth = require('oauth');
var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      'pyS7oRP9dTqarSV2a6FBOGYwd',
      'krR4rCNy8cJecVDxZcnAtTQVBZEdCs2R9eSPtckBvoKSUVu9cD',
      '1.0A',
      null,
      'HMAC-SHA1'
    );
    oauth.get(
      'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+name+'&count='+(count),
      '2742674484-1qIamhT09a4vzW6QbtVgG5hGTQmf6nTytYK9oRv', //test user token
      'C8Gn56kOb7mCx1Bp8PAeEi5sXKHVmuKJziQ32YDvb4Vxc', //test user secret            
      callback
      );    
  }

  function serveFile(request,response){
    var filePath = '.' + request.url;
if (filePath == './')
    filePath = './index.html';

var extname = path.extname(filePath);
var contentType = 'text/html';
switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.json':
        contentType = 'application/json';
        break;
    case '.png':
        contentType = 'image/png';
        break;      
    case '.jpg':
        contentType = 'image/jpg';
        break;
    case '.wav':
        contentType = 'audio/wav';
        break;
}

fs.readFile(filePath, function(error, content) {
    if (error) {
        if(error.code == 'ENOENT'){
            fs.readFile('./404.html', function(error, content) {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            });
        }
        else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end(); 
        }
    }
    else {
        console.log('served ',filePath);
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    }
});

  }