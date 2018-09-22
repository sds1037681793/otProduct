var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require("fs")
var url = require('url');

var indexRouter = require('./routes/index');
var indexContent = require('./routes/indexContent');
var usersRouter = require('./routes/users');

var router = express.Router();
//获取post Body中的数据
const bodyParser=require('body-parser');

//生成excel需要
var nodeExcel = require('excel-export');
const disableLayout ={layout: false};




//form表单需要的中间件。
var mutipart= require('connect-multiparty');
var mutipartMiddeware = mutipart();
var iconv = require('iconv-lite');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
   extended: false,                 //扩展模式
   limit:    2*1024*1024           //限制-2M
  }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//session 需要
var session = require('express-session');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/index', indexContent);
app.use('/users', usersRouter);
app.use('/api', router);

router.use(session({
  excelData:"",
  secret: '1234567890QWERTY'
}))
//这里就是接受form表单请求的接口路径，请求方式为post。
app.post('/upload',mutipartMiddeware,function (req,res) {
  const { files } = req;
 
  var dataList = [];
 
  if(files.myfile instanceof Array){
    for(var k = 0; k <files.myfile.length ; k++){
      var data = {};
      data.list = readFile(files.myfile[k]);
      data.name = files.myfile[k].name;
      dataList.push(data)
    }
  }else{
    var data = {};
    data.list =readFile(files.myfile);
    data.name =files.myfile.name;
    dataList.push(data)
  }
 
  res.json(200,{data:dataList});
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

router.get('/exportExcel/:id', function(req, res, next) {
   var dataList =JSON.parse(req.session.excelData.data);
  
   var confs = [];
   
  for (var i = 0; i < dataList.length; i++) {
   
     var conf = {};
     conf.cols = [];
     conf.rows =[];

     
      for (var k = 0; k < dataList[i].text.length; k++) {
        var rowsContent = [];
        conf.cols = [];
        for(var m = 0; m < dataList[i].text[k].content.length; m++){
          rowsContent.push(dataList[i].text[k].content[m].content);
          conf.cols.push({
            caption: dataList[i].text[k].content[m].colspan,
            type: 'string'
        })
        }
        conf.rows.push(rowsContent)
      }
    
      console.log(conf.rows)
      conf = JSON.parse(JSON.stringify(conf));   //clone
      conf.name = dataList[i].title;
     
      confs.push(conf);
  }
 
  var result = nodeExcel.execute(confs);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  res.end(result, 'binary');
});

//这里就是接受form表单请求的接口路径，请求方式为post。
router.post('/saveExcelData',function (req,res) {
  req.session.excelData = req.body;
  res.json(200);
});

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
