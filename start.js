// in sublime
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.set("view options", {layout: false});
app.use(express.static(__dirname + '/dist'));




app.get('/', function(req, res) {
  res.render('index.html');
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});