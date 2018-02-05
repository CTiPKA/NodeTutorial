var http = require("http"),
  express = require("express"),
  path = require("path");

var app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.send("<html><body><h1>Hello World</h1></body></html>");
});

app.get("/:a?/:b?/:c?", function(req, res) {
  res.send(req.params.a + " " + req.params.b + " " + req.params.c);
});

//wrong address error handing
app.use(function(req, res) {
  //1
  res.render("404", { url: req.url }); //2
});

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
