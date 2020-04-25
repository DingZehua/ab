var http = require("http");
var url = require('url');

var ADODB = require('node-adodb');
var cn = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source='+ "D:\\www\\database\\Database3_be.accdb;");

var express = require('express');
var app = express();

app.get('/data',(req,res) => {
  let result = {error : 0,data : ''};
  if(!empty(req.query)) {
    let sql = 'SELECT * FROM box ' + where(req.query);
    console.log(sql);
    cn.query(sql).then(
      (data) => {
        console.log(data);
        result.data = data;
      },
      (error) => {
        result.error = 1;
      }
    ).then(() => {
      res.send(JSON.stringify(result))
    });
  } else {
    res.send();
  }
  
});

app.use('/server.js',function(req,res) {
  res.send('404');
})


app.get('/*.*', function (req, res) {
  res.sendFile(convert(req.path));
});

app.get('/ship_data',function(req,res){
  if(req.query.ship_no) {
    let ship_no = addSlash(req.query.ship_no);
    let result = {error : 0,data : null};
    cn.query(`SELECT * FROM ship_table WHERE ship_no = "${ship_no}"`).then(
      (data) => {
        result.data = data;
      },
      (error) => {
        result.error = 1;
        console.log(error);
      }
    ).then(() => {
      res.send(JSON.stringify(result));
    });
    return;
  }
  res.send('error,unFine param ship_data');
});

var server = app.listen({host:"192.168.0.115",port : 80}, function () {
 
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
});


function addSlash(str) {
  return str.replace(/[']/g,'\\\'').replace(/["]/g,'\\"').replace(/[`]/g,'\\`');

}

function convert(path) {
  str = path.split('.');
  str[0] = str[0].replace('\/',"\\");
  return 'D:\\www' + str.join('.');
}

function where(params,order) {
  let where = '';
  let range = 0;
  if(!empty(params.range)) {
    range = params.range;
  }

  delete params.range;
  
  for(let name in params) {
    if(params.hasOwnProperty(name)){
      if(where != '') where += ' AND ';
      if(range && (name == 'len' || name == 'width' || name == 'height')) {
          console.log(typeof params[name],typeof range);
          where += name + '>' + (params[name] - range) + ' AND ' + name + '<' + (+params[name] + (+range)) + ' ';
      } else if(name == 'brand') {
        where += name + ' LIKE "%' + params[name] + '%" ';
      } else {
        where += name + '=' + params[name] + ' ';
      }
    }
  }
  if(where != '') {
    where = ' WHERE ' + where;
  }

  where += ' ORDER BY len '

  if(order) {

  }
  console.log(where);
  return where;
}

function empty(obj) {
  if (obj === undefined) {
    return true;
  }
  if (typeof obj === 'object') {
    if (obj === null) {
      return true;
    }
    if (typeof obj.length === 'number') {
      if (obj.length > 0) {
        return false
      }
      return true;
    }

    if(obj instanceof Number) {
      if(obj.valueOf() === 0 || isNaN(obj.valueOf())) {
        return true;
      }
      return false;
    }

    if(obj instanceof String) {
      const str = obj.valueOf().toLocaleLowerCase();
      if(str === 'undefined' || str === 'null' || str === 'undefined'){
        return true;
      }
      return false;
    }

    for (var key in obj) {
      return false;
    }
    return true;
  }
  if (typeof obj === 'string') {
    const str = obj.toLocaleLowerCase();
    if (str !== '' && str !== '0' && str !== 'null' && str !== 'undefined') {
      return false;
    }
    return true;
  }
  if (obj.constructor === Number) {
    if (obj === 0 || isNaN(obj)) {
      return true;
    }
  }
  return false;
}