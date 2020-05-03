var http = require("http");
var url = require('url');

var ADODB = require('node-adodb');
var cn = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source='+ "D:\\www\\database\\Database3_be.accdb;");

var express = require('express');
var app = express();
const C = require('./CONSTANT');

app.get('/data',(req,res) => {
  let result = {error : 0,data : ''};
  if(!empty(req.query)) {
    let upMove = 5;
    // let sql = `
    //           SELECT top ${upMove} * FROM box WHERE box_id not in(
    //           SELECT top ${ upMove * 2 } box_id FROM box )
    //           ${where(req.query)}`;
    let sql = `SELECT * FROM box  ${where(req.query)}`;
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

app.get('/ship_see',async function(req,res){
  if(req.query.ship_no) {
    let ship_no = addSlash(req.query.ship_no);
    /* 执行中 = 1,完成 = 2, 中断 = 6, 超时 = 7, 删除 = 8 */
    let sql = `SELECT 
                ship_table.ship_no AS ship_no,ship_table.number AS \`number\` ,ship_table.sub_number AS sub_number ,ship_table.brand as brand,
                ship_table.quantity AS quantity,ship_table.ship_time AS ship_time,ship_table.missed AS \`missed\`,
                ship_table.completed AS completed,ship_state.state_name AS state 
                FROM ship_table 
                LEFT JOIN ship_state AS ship_state ON ship_table.state = ship_state.id
                WHERE ship_no = "${ship_no}" AND state <> 8`;
    res.send(await queryToJSON(sql));
    return;
  }
  res.send('Error,unFine param ship_data');
});

app.get('/ship_modify', async function(req,res) {
  if(!empty(req.query.ship_no)) {
    let ship_no = req.query.ship_no;
    delete req.query.ship_no;
    if(!empty(req.query)) {
      res.send(await updateExceute('ship_table',req.query,'ship_no',ship_no));
    }
    return;
  }
  res.send('Error,params invalid');
});

var server = app.listen({host:"192.168.0.115",port : 80}, function () {
 
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
});

async function query(sql) {
  let result = {error : 0,data : null};
  await cn.query(sql).then((data) => { result.data = data;},(error) => { result.error = 1;console.log(error) })
  return result;
}

async function queryToJSON(sql) {
  return JSON.stringify(await query(sql))
}

async function execute(sql) {
  let result = {error : 0,data : null};
  await cn.execute(sql,`SELECT @@Identity AS id`).then((data) => { result.data = data;},(error) => { result.error = 1;console.log(error) })
  return result;
}

async function executeToJSon(sql) {
  return JSON.stringify(await execute(sql))
}

async function updateExceute(tableName,data,where,whereVal) {
  let sql = `UPDATE ${tableName} SET `;
      for(let field in data) {
        if(data.hasOwnProperty(field))
          sql += `\`${field}\` = '${addSlash(data[field])}',`;
      }
      sql = sql.slice(0,-1);
      sql += ` WHERE ${where} = '${whereVal}'`;
  return await executeToJSon(sql);
}

async function inster(tableName,data) {
  let sql = `INSERT INTO ${tableName} (\`${Object.keys(data).join('`,`')}\`) VALUES('${Object.values(data).join("','")}')`;
  return await execute(sql);
}

function addSlash(str) {
  if(str.constructor !== String) return str;
  return str.replace(/[']/g,'\\\'').replace(/["]/g,'\\"').replace(/[`]/g,'\\`');

}

function convert(path) {
  str = path.split('.');
  str[0] = str[0].replace('\/',"\\");
  return 'D:\\www' + str.join('.');
}

function addship(data) {
  let time = new Date();
  inster('ship_table',{
    ship_no : 'ship_' + time.getTime(),
    ...data,
    ship_time : time.getFullYear() + '-' + time.getMonth() + '-' + time.getDay()
  });
}



function where(params,order) {
  let where = '';
  let range = 0;
  if(!empty(params.range)) {
    range = params.range;
  }

  delete params.range;
  delete params.page; 

  for(let name in params) {
    if(params.hasOwnProperty(name)){
      if(where != '') where += ' AND ';
      if(range && (name == 'len' || name == 'width' || name == 'height')) {
          where += name + '>=' + (params[name] - range) + ' AND ' + name + '<=' + (+params[name] + (+range)) + ' ';
      } else if(name == 'brand') {
        where += name + ' LIKE "%' + addSlash(params[name]) + '%" ';
      } else {
        where += name + '=' + addSlash(params[name]) + ' ';
      }
    }
  }
  if(where != '') {
    where = ' WHERE ' + where;
  }

  where += ' ORDER BY len,width,height '

  if(order) {

  }
  console.log(where);
  return where;
}

function getDate(obj) {
  let time = null
  if(obj instanceof Date) {
    time = obj;
  } else if(obj) {
    time = new Date(obj);
  } else {
    time = new Date();
  }

  let result = {};

  let [,month,day,year] = time.toDateString().split(' ');

  month = C.MONTH[month];
  result.month = parseInt(month);
  result.year = parseInt(year);
  result.day = parseInt(day);
  result.time = time.getTime();
  result.hours = time.getHours();
  result.minutes = time.getMinutes();
  result.seconds = time.getSeconds();

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  result.fullDate = year + '-' + month + '-' + day;

  return result;
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