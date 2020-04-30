var namespace = function () {
    this.css = {
      'removeClassName': function (str, ClassName) {
        var strArr = str.split(' ');
        var returnStr = '';
        for (var i = 0; i < strArr.length; i++) {
          if (strArr[i] !== ClassName) {
            if (returnStr !== '') {
              returnStr += ' ' + strArr[i];
            }
            else {
              returnStr = strArr[i];
            }
          }
        }
        return returnStr;
      },
      'removeClass': function (obj, ClassName) {
        try {
          obj.classList.remove(ClassName);
        }
        catch (e) {
          obj.className = this.removeClassName(obj.className, ClassName);
        }
      },
      'addClass': function (obj, ClassName) {
        try {
          obj.classList.add(ClassName);
        }
        catch (e) {
          obj.className += ' ' + ClassName;
        }
      },
      'removeAttr': function (ele, attrName) {
        ele.removeAttribute(attrName);
      },
      'disable': function (ele) {
        ele.disabled = 'disabled';
      },
      'enable': function (ele) {
        this.removeAttr(ele, 'disabled');
      }
    };
    this.size = {
      'swb': function (ele) {
        try { return ele.clientWidth; }//获取内容的宽度，包含border的宽度
        catch (e) { console.log(e); }
      },
      'shb': function (ele) {
        try { return ele.clientHeight; }//获取内容的高度，包含border的宽度
        catch (e) { console.log(e); }
        //window对象:不包括浮动元素[float]
      },
      'sw': function (ele) {
        try { return ele.offsetWidth; }//获取内容的宽度(不包括隐藏)，包含border的宽度
        catch (e) { console.log(e); }
      },
      'sh': function (ele) {
        try { return ele.offsetHeight; }//获取内容的高度(不包括隐藏)，包含border的宽度
        catch (e) { console.log(e); }
      },
      'cw': function (ele) {
        try { return ele.scrollWidth; }//获取标签内的宽度
        catch (e) { console.log(e); }
      },
      'ch': function (ele) {
        try { return ele.scrollHeight; }//获取标签内的高度
        catch (e) { console.log(e); }
      },
      'spt': function () {
        try { return window.screenTop; }//获取浏览器顶部的坐标
        catch (e) { console.log(e); }
      },
      'spl': function () {
        try { return window.screenLeft; }//获取浏览器左部的坐标
        catch (e) { console.log(e); }
      },
      'ht': function (ele) {
        try { return ele.scrollTop; }//获取隐藏的高
        catch (e) { console.log(e); }
      },
      'hl': function (ele) {
        try { return ele.scrollLeft; }//获取隐藏的右边
        catch (e) { console.log(e); }
      },
      'sah': function () {
        try { return window.screen.availHeight; }//屏幕可用工作区高度
        catch (e) { console.log(e); }
      },
      'saw': function () {
        try { return window.screen.availWidth; }//屏幕可用工作区宽度
        catch (e) { console.log(e); }
      }
    };
    this.common = {
      'empty': function (obj) {
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
      },
      'gClasses': function (className) {
        if (typeof document.getElementsByClassName !== 'undefined') {
          return document.getElementsByClassName(className);
        }
        else {
          var classNodes = Array();
          var dom = this.gTags('*');
          for (var i = 0; i < dom.length; i++) {
            if (dom[i].className.indexOf(className) > -1) {
              classNodes.push(dom[i]);
            }
          }
          return classNodes;
        }
      },
      'gClass': function (className) {
        return this.gClass(className)[0];
      },
      'gNames': function (Name) {
        return document.getElementsByName(Name);
      },
      'gName': function (Name) {
        return this.gNames(Name)[0];
      },
      'gTags': function (TagName) {
        return document.getElementsByTagName(TagName);
      },
      'gTag': function (TagName) {
        return this.gTags(TagName)[0];
      },
      'g': function (str) {
        if (!/[#.>:@~]|\s/.test(str)) {
          return document.getElementById(str);
        }
        else if (/^[#][a-zA-Z0-9_\-]+$/.test(str)) {
          return document.querySelector(str);
        }
        else if(str[0] === '~'){
          str = str.replace('~','');
          return document.querySelector(str);
        } else {
          str = str.replace(/@/g, '');
          return document.querySelectorAll(str);
        }
      },
      'gs' : function(str) {
        if(str[0] !== '@') str = '@' + str;
        return this.g(str);
      }
      ,
      '$': function (str) { return this.g(str); },
      'cNode': function ({EleName, id, className, text}) {
        var Node = document.createElement(EleName);
  
        if (!this.empty(text)) {
          this.appendNode(Node, this.cTextNode(text));
        }
  
        if(id) {
          Node.id = id;
        }
        if(className) {
          Node.className = className;
        }
        return Node;
      },
      'cTextNode': function (text) {
        return document.createTextNode(text);
      },
      'appendNode': function (ele, childNode) {
        (childNode !== undefined && childNode !== null) ? ele.appendChild(childNode) : '';
      },
      'ajax': function (data, url, callback, sendType, dataName, async) {
        if (!url) { return; }
        var sendType = sendType ? sendType.toUpperCase() : 'GET';
        var async = async || true;
        var callback = callback || function () { };
        var xmlhttp = null;
        if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
        else { xmlhttp = new ActiveXObject('Microsolft.XMLHTTP'); }
  
        var sendData = '';
        if (typeof data === 'string' || typeof data === 'number') {
          if (dataName === void 0 || typeof dataName !== 'string' || dataName === '') { sendData = 'jsonData' + '=' + data; }
          else { sendData = dataName + '=' + data; }
        }
        else {
          if (dataName === void 0 || typeof dataName !== 'string' || dataName === '') {
            for (var key in data) {
              sendData += '&' + key + '=' + data[key];
            }
          }
          else {
            for (var key in data) {
              if(sendData != '')
                sendData += '&';
              sendData += dataName + '[' + key + ']=' + data[key];
            }
          }
          sendData[0] = '';
        }
        if (sendType === 'GET') {
          if (url.indexOf('?') < 0) { url += '?' + sendData; }
          else { url += '&' + sendData; }
        }
  
        xmlhttp.open(sendType, url, async);
        if (sendType === 'POST') {
          xmlhttp.setRequestHeader('accept', 'appliction/json');
          xmlhttp.repsonseType = 'json';
        }
  
        if (sendType === 'POST') xmlhttp.send(sendData);
        else xmlhttp.send();
  
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 414) {
              throw ('url length size exceed limit');
            }
            else if (xmlhttp.status === 200) {
              callback instanceof Function ? callback.call(xmlhttp, xmlhttp.responseText) : '';
            }
          }
        }
        return xmlhttp;
      },
      'post': function (jsonData, uri, F_success, _async) {
        var result;
        _async = typeof _async !== 'undefined' ? _async : true;
        result = this.ajax(jsonData, uri, F_success, 'POST', '', _async);
        return result.responseText;
      },
      'get': function (jsonData, uri, F_success, _async) {
        var result;
        _async = typeof _async !== 'undefined' ? _async : true;
        result = this.ajax(jsonData, uri, F_success, 'GET', '', _async);
        return result.responseText;
      },
  
      'binds': function (eles, event_name, F_Object) {
        if (typeof eles === undefined || event_name === '') {
          return false;
        }
  
        if ((eles.constructor === NodeList || eles instanceof Object) && typeof eles.length !== 'undefined') {
          for (var i = 0; i < eles.length; i++) {
            this.bind(eles[i], event_name, F_Object);
          }
        }
        else {
          this.bind(eles, event_name, F_Object);
        }
      },
      'bind': function (obj, event_name, F_Object, capture_bool) {
        if(!(obj instanceof HTMLElement)) { 
          throw TypeError('obj must is a HTMLElement');
        }
        if(typeof event_name !== 'string') {
          throw TypeError('event_name must is a string.')
        }
        if(!(F_Object instanceof Function)) {
          throw TypeError('F_Object must is a Function.')
        }
        var capture_bool = typeof capture_bool === 'boolean' ? capture_bool : false;
        if (typeof obj.addEventListener !== 'undefined') {
          obj.addEventListener(event_name, F_Object, capture_bool);
        }
        else {
          obj.attachEvent('on' + event_name, F_Object);
        }
      },
      'freed': function (obj, event_name, F_Object, capture_bool) {
        if (typeof obj === undefined || obj === null) return false;
        capture_bool = typeof capture_bool === 'boolean' ? capture_bool : false;
        if (typeof obj.removeEventListener !== 'undefined') {
          obj.removeEventListener(event_name, F_Object, capture_bool);
        }
        else {
          obj.detachEvent('on' + event_name, F_Object);
        }
      },
      'stop_event_conduct': function (e) {
        if (typeof e === 'object' && e.stopPropagation) {
          e.stopPropagation();
        }
        else {
          e.cancelBubble = true;
        }
      },
      'stop_default_event': function (e) {
        if (e.preventDefault instanceof Function) {
          e.preventDefault();
        }
        if (e.returnValue !== undefined) {
          e.returnValue = false;
        }
      },
      'toJSON': function (data) {
        var jsonData = JSON.stringify(data);
        return jsonData;
      },
      'JSONtoObj': function (jsonData) {
        return JSON.parse(jsonData);
      },
      'copy'  : function(o) {
          return JSON.parse(JSON.stringify(o));
      },
      'get_uri_param': function (name) {
        name = name || '';
        var uri = window.location.search.replace('?', '');
        if (uri === '' || name === '') {
          return false;
        }
        var exp = new RegExp('([?]?)([&]?)(' + name + ')([=])([^&]*)');
        var paramArr = exp.exec(uri);
        var param = paramArr !== null && paramArr !== '' ? paramArr[paramArr.length - 1] : false;
        return param;
      },
      'change_uri_param': function (name, replace_param) {
        var param = this.get_uri_param(name);
        if (param)
          window.location.search = window.location.search.replace(name + '=' + param, name + '=' + replace_param);
      },
      'deep_delete_var': function (obj) {
        for (var key in obj) {
          if (!(obj[key] instanceof HTMLElement)
            && typeof obj[key] !== 'string'
            && !(obj[key] instanceof String)) {
            this.deep_delete_var(obj[key]);
          }
        }
        for (var key in obj) {
          delete obj[key];
        }
      },
      'scrollTo': function (el, left, top) {
        var left = left || 0;
        var top = top || 0;
        if (typeof el.scrollTo === 'function') {
          el.scrollTo(left, top);
          return;
        }
        el.scrollLeft = left;
        el.scrollTop = top;
      }
    };
  };
  
  namespace.prototype =
    {
      constructor : namespace,
      'EventHandler': function (modules)/*观察者模式*/ {
        this.handlers = {};
        this.add = function (type, handler) {
          if (typeof handler !== 'function') {
            return;
          }
          if (this.handlers[type] === undefined) {
            this.handlers[type] = [];
          }
          this.handlers[type].push(handler);
        }
        this.add_group = function (type, handers) {
          //检查是否在module中
          if (this.module !== this) {
            if (this.module[type] === undefined) {
              Object.assign(this.module, type, handers);
            }
          }
          if (handers !== undefined && typeof type === 'string') {
            if (handers instanceof Array) {
              for (var i = 0, len = handers.length; i < len; i++) {
                this.add(type, handers[i]);
              }
            }
            else if (handers instanceof Object) {
              for (var key in handers) {
                this.add(type, handers[key]);
              }
            }
          }
        };
        this.on = function (type) {
          if (this.handlers[type] !== undefined) {
            var Event = {
              type: type,
              target: this
            };
            if (this.handlers[type].length > 0) {
              var args = [];
              for (var i = 1, len = arguments.length; i < len; i++) {
                args[i - 1] = arguments[i];
              }
              for (var i = 0, len = this.handlers[type].length; i < len; i++) {
                var module;
                if (this.module === this || this.module[type] === undefined) {
                  //事件内部-无法-调用新增加在事件中的对象
                  module = this.handlers[type];
                }
                else {
                  //事件内部-可以-调用新增加在事件中的对象
                  module = this.module[type];
                }
                this.handlers[type][i].apply(module, args);
              }
            }
          }
        };
        this.handlers_exists = function (type) {
          return this.handlers[type] !== undefined;
        };
        this.on_all = function () {
          if (this.handlers !== undefined) {
            for (var type in this.handlers) {
              this.on(type, arguments);
            }
          }
        };
        this.out = function (type, handler) {
          if (this.handlers[type] === undefined) {
            return;
          }
          if (handler !== undefined) {
            for (var i = 0, len = this.handlers[type].length; i < len; i++) {
              var sources = this.handlers[type][i];
              if (sources === handler) {
                this.handlers[type].splice(i, 1);
                break;
              }
            }
            if (this.handlers[type].length < 1) {
              delete this.handlers[type];
            }
          }
          else {
            delete this.handlers[type];
          }
          console.log('remove success');
        };
        if (!!modules) {
          if (typeof modules !== 'object') {
            return false;
          }
          this.module = modules;
          !(function (modules) {
            for (var type in modules) {
              var module = modules[type];
              //__add为false表示不添加到事件管理器中
              if (typeof module === 'object' && (module['__add'] === undefined || module['__add'])) {
                this.add_group(type, module);
              }
            }
            modules['EventHandler'] = this;
          }.call(this, modules)
          );
        }
        else {
          this.module = this;
        }
      },
      'defineEvent': function (type, canBubble, cancelable)/*自定义事件*/ {
        this.ele = null;
        this.constructor = namespace;
        if (document.createEvent !== undefined) {
          //谷歌等内核
          var canBubble = canBubble || false;
          var cancelable = cancelable || false;
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent(type, canBubble, cancelable);
          this.fire = function () {
            this.ele.dispatchEvent(evt);
          }
          Object.defineProperty(this, "Event_name", {
            value: type,
            writable: false
          });
        }
        else {
          //对IE进行处理
          var propertychange = type + '_' + Math.random();
          this.fire = function () {
            this.ele[propertychange] = Math.random();
          }
          if (Object.defineProperty !== undefined) {
            Object.defineProperty(this, "Event_name", {
              value: 'propertychange',
              writable: false
            });
          }
          else {
            this.Event_name = 'propertychange';
          }
        }
        this.on = function (ele) {
          this.ele = ele;
          this.fire();
        }
      }
    }
  var myns = new namespace();
  var cm = myns.common;
  var css = myns.css;
  var size = myns.size;
  var log = console.log.bind(console);
  //dom.querySelector
  
  /*EventHandler接口*/
  /*
  //示例
  var modules = function()
  {
    var _self = this;
    var _global = null;
    this.obj_list_fun = {
    }
  }
  var eh = new myns.EventHandler(new modules());
  */
  
  
  
  
  
  
  
  
  
  /*
  if(window.localStorage !== void 0){
    var ls = window.localStorage;
    var ss = window.sessionStorage;
  }
  */
  
  
  //绑定 window.onload event中的srcElement 等于 document 
  
  
  
  
  
  
  
  //css ie8获取单个css多个名称，用 css 里面的样式一个一个去对比
  //获取CSS样式
  //console.log(returnSize.currentStyle.width); ie
  //console.log(window.getComputedStyle(returnSize).width); ie
  /*
  //获取css样式文件
  var obj = document.styleSheets[0];
  if( obj.cssRules ) {
      // 非IE [object CSSRuleList]
      rule = obj.cssRules[0];
  } else {
      // IE [object CSSRuleList]
      rule = obj.rules[0];
  }
  */