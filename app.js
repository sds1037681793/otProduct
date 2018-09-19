var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require("fs")

var indexRouter = require('./routes/index');
var indexContent = require('./routes/indexContent');
var usersRouter = require('./routes/users');

//form表单需要的中间件。
var mutipart= require('connect-multiparty');
var mutipartMiddeware = mutipart();
var iconv = require('iconv-lite');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexContent);
app.use('/users', usersRouter);


//这里就是接受form表单请求的接口路径，请求方式为post。
app.post('/upload',mutipartMiddeware,function (req,res) {
  const { files } = req;
 
  var dataList = [];
  if(files.myfile instanceof Array){
    for(var k = 0; k <files.myfile.length ; k++){
      dataList[k] = readFile(files.myfile[k]);
    }
  }else{
    dataList[0] =readFile(files.myfile);
  }
  console.log(dataList)
  res.json(200,{data:dataList})
 
  //这里打印可以看到接收到文件的信息。
 
  /*//do something
  * 成功接受到浏览器传来的文件。我们可以在这里写对文件的一系列操作。例如重命名，修改文件储存路径 。等等。
  *
  *
  * */

  //给浏览器返回一个成功提示。
  // res.json({
  //   msg: '上传成功2'
  // });
});


function readFile(myfile){
  var buf = new Buffer(fs.readFileSync(myfile.path,"utf8"), 'binary');
  var str = iconv.decode(buf,'GBK');
  var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
  var result = REG_BODY.exec(str);
  if(result && result.length === 2)
      str= result[1];  
  return  str.replace(/\"/g,"\'")
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
