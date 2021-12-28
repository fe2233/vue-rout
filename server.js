var express = require("express");
var app = express();
var mysql = require("mysql");
app.use("/rout", express.static("rout"));

var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "123456",
  database : "sales"
});
connection.connect();
 
app.get("/getList", function (req, res) {
	connection.query("SELECT * from sale", function (error, results, fields) {
	  if (error) throw error;
	  res.send(JSON.stringify(results));
	});	
});
app.post("/add/:name/:month/:dones/:doneCount", function (req, res) {
	var sql = "select * from sale where name='"+req.params.name+"' and month="+req.params.month;
	connection.query(sql, function (error, results) {
	  if (error) throw error;
	  if(results.length > 0) {
		  res.send("exist");
		  return;
		}
	});
	sql = "insert into sale value(0,'"+req.params.name+"',"+req.params.month+","+req.params.dones+","+req.params.doneCount+")";
	connection.query(sql, function (error, results) {
	  if (error) throw error;
	  if(results != null) {
		  res.send("success");
		}
	});
});
app.post("/delData/:id", function(req, res) {
	var sql = "delete from sale where id="+req.params.id;
	connection.query(sql, function (error, results) {
	  if (error) throw error;
	  if(results != null) {
		  res.send("success");
		}
	});
});
app.post("/update/:id/:dones/:doneCount", function(req, res) {
	var sql = "update sale set dones="+req.params.dones+",doneCount="+req.params.doneCount+" where id="+req.params.id;
	connection.query(sql, function (error, results) {
	  if (error) throw error;
	  if(results != null) {
		  res.send("success");
		}
	});
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
 
  console.log("服务器启动，访问地址为 http://%s:%s", host, port);
})