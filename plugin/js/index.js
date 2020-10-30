chrome.tabs.getSelected(null, function(tab) {
  // Send a request to the content script.
  chrome.tabs.sendMessage(tab.id, {message: "getInfo"}, function(response) {
    document.getElementById('articleName').innerHTML = "Wikipedia Article: " + response.title;
    wiki_title = response.title;
  });
});

toggle.addEventListener('change', (event) => {
  beautifier.setValue("SELECT `To`, `Count`\n  FROM `Clickstream`\n  WHERE `From`='" + wiki_title + "';");
  config.sql.exec("clickstream");
});

function hideToggle(){
  document.getElementById('recolourToggle').style.visibility = "hidden";
}

function showToggle(){
  document.getElementById('recolourToggle').style.visibility = "visible";
}

hideToggle();
document.getElementById('recolourUnavailable').style.visibility = "hidden";

function getValue(callback) {
  chrome.storage.sync.get('checked', callback);
};

var background = (function () {
  var r = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.path === 'background-to-ui') {
      for (var id in r) {
        if (request.method === id) r[id](request.data);
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {r[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'ui-to-background', "method": id, "data": data})}
  }
})();

var config = {
  "time": {
    "start": null,
    "tic": function () {
      config.loader.start();
      config.time.start = performance.now();
    },
    "toc": function (e, r) {
      config.loader.stop();
      var total = Math.round(((performance.now() - config.time.start) / 1000) * 100) / 100 || "0.00";
    	if (e) config.sql.info.textContent = config.sql.info.textContent + ' ' + e + (r ? ": " + total + "sec" : '');
    }
  },
  "loader": {
    "stop": function () {
      var loader = document.getElementById("loader");
      var img = loader.querySelector("img");
      img.style.display = "none";
    },
    "start": function () {
      var loader = document.getElementById("loader");
      var img = loader.querySelector("img");
      img.style.display = "initial";
    }
  },
  "app": {
    "worker": new Worker("vendor/sql/worker.sql.js"),
    "error": function (e) {config.time.toc(e.message, false)},
    "clear": function () {
      config.time.tic();
      config.sql.info.textContent = '';
      // config.sql.output.textContent = '';
      config.time.toc('', false);
    },
    "savedb": function () {
      console.log('savedb');
    	config.app.worker.onmessage = function (e) {
        config.time.toc(chrome.i18n.getMessage('app_notify6'), true);
    		var arraybuffer = e.data.buffer;
    		var blob = new Blob([arraybuffer]);
    		var a = document.createElement('a');
        a.download = "sql.db";
    		a.href = window.URL.createObjectURL(blob);
        document.body.appendChild(a);
    		a.onclick = function () {
          window.setTimeout(function () {
            window.URL.revokeObjectURL(a.href);
            a.parentNode.removeChild(a);
          }, 1500)
        };
    		a.click();
    	};
      /*  */
    	config.time.tic();
    	config.app.worker.postMessage({"action": "export"});
    },
    "execute": function (cmd, type) {
      console.log(cmd);
    	config.time.tic();
    	config.app.worker.onmessage = function (e) {
    		var results = e.data.results;
        console.log(results);
        if (results) {
          if(type=="minutes"){
            if(results.length == 0){
              document.getElementById('readingTime').innerHTML = "Estimated Reading Time Unavailable";
            } else {
              document.getElementById('readingTime').innerHTML = "Estimated Reading Time: " + Math.ceil((results[0].values)[0][0]) + " minutes";
            }
            showToggle();
            getValue(function(key){
              if (key['checked']) {
                toggle.dispatchEvent(new Event('change'));
              };
            });
          }
          if(type=="clickstream"){
            //need to send to content.js
            console.log('clickstream');
            console.log(results);
            if(results.length == 0){
              hideToggle();
              document.getElementById('recolourUnavailable').style.visibility = "visible";
            } else {
              chrome.tabs.query({active: true,currentWindow:true},function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {message: results[0].values}); // sends message to content.js to change link colours
              });
            }
          }
      		config.time.toc(chrome.i18n.getMessage('app_notify4'), true);
      		config.time.tic();
      		config.time.toc(chrome.i18n.getMessage('app_notify5'), true);
        }
    	}
      /*  */
      config.app.worker.postMessage({"action": 'exec', "sql": cmd});
    }
  },
  "sql": {
    "file": null,
    "info": document.getElementById("info"),
    "dbfile": document.getElementById("dbfile"),
    "commands": document.getElementById("commands"),
    "exec": function (type="") {config.app.execute(beautifier.getValue() + ';', type)},
    "size": function (s) {
      if (s) {
        if (s >= Math.pow(2, 30)) {return (s / Math.pow(2, 30)).toFixed(1) + "GB"};
        if (s >= Math.pow(2, 20)) {return (s / Math.pow(2, 20)).toFixed(1) + "MB"};
        if (s >= Math.pow(2, 10)) {return (s / Math.pow(2, 10)).toFixed(1) + "KB"};
        return s + "B";
      } else return '';
    },
  },
  "create": {
    "table": function () {
      var add = function (a, b, c) {
        if (a) {
          var parent = document.createElement(c);
          for (var i = 0; i < a.length; i++) {
            var tmp = document.createElement(b);
            tmp.textContent = a[i];
            parent.appendChild(tmp);
          }
          return parent;
        }
        /*  */
        var parent = document.createElement(c);
        var tmp = document.createElement(b);
        tmp.textContent = "null";
        parent.appendChild(tmp);
        return parent;
      };
      /*  */
      return function (columns, values) {
        var table  = document.createElement("table");
        table.appendChild(add(columns, "th", "thead"));
        for (var i = 0; i < values.length; i++) table.appendChild(add(values[i], "td", "tr"));
        return table;
      }
    }()
  }
};

var beautifier = CodeMirror.fromTextArea(config.sql.commands, {
  "autofocus": true,
  "smartIndent": true,
  "lineNumbers": true,
  "matchBrackets": true,
  "mode": 'text/x-mysql',
  "indentWithTabs": true,
  "viewportMargin": Infinity
});

function loadDBFile(reader){
  var fileinfo = document.getElementById("fileinfo");
  console.log("file");
  console.log(config.sql.file.name);
  fileinfo.textContent = config.sql.file.name + ' ' + config.sql.size(config.sql.file.size);
  /*  */
  reader.onload = function () {
    config.app.worker.onmessage = function () {
      config.time.toc(chrome.i18n.getMessage('app_notify1'), true);
      beautifier.setValue("SELECT `AdjustedReadingTimeMinutes`\n  FROM `Difficulty`\n  WHERE Article='" + wiki_title + "';");
      config.sql.exec("minutes");
    };
    /*  */
    config.time.tic();
    try {config.app.worker.postMessage({"action": 'open', "buffer": reader.result}, [reader.result])}
    catch (e) {config.app.worker.postMessage({"action": 'open', "buffer": reader.result})}
  }
  /*  */
  if (config.sql.file) reader.readAsArrayBuffer(config.sql.file);
};

var load = function () {
  
  var localization = new Localize();
  localization.init();
  localization.localizeHtmlPage();

  config.time.tic();
  config.app.worker.onerror = config.app.error;
  window.removeEventListener("load", load, false);
  config.app.worker.postMessage({"action": "open"});
  chrome.storage.local.get('dbfile', function(result){
    console.log('what');
    if(result.dbfile != null){
      var reader = new FileReader();
      config.sql.file = result.dbfile;
      console.log('GET');
      console.log(config.sql.file);
      console.log(typeof config.sql.file);
      loadDBFile(reader);
      
    }
  })
  config.sql.dbfile.addEventListener("change", function () {
    var reader = new FileReader();
  	config.sql.file = config.sql.dbfile.files[0];
    console.log(JSON.stringify(config.sql.file));
    console.log('SET');
    console.log(config.sql.file);
    console.log(typeof config.sql.file);
    loadDBFile(reader);
  });
  var commands = document.getElementById("commands");
  config.time.toc(chrome.i18n.getMessage('app_notify2'), false);
};

window.addEventListener("load", load, false);


