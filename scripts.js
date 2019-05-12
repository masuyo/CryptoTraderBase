var baseUrl = "https://obudai-api.azurewebsites.net/api";
var cors = "https://obudai-api.azurewebsites.net/";
var apiKey = "3D2ADF61-84D2-42A2-A715-A207B67A8CD8";
var sites = ["main", "transactions", "settings"];
var startPage = "main";
var balance = [{ usd: NaN, btc: NaN, eth:NaN, xrp:NaN}];
var currentRates = [
    {
    type: "btc",
    value: NaN,
    history:{'1900-01-01 00:00':NaN,'1900-01-02 00:00':NaN,'1900-01-03 00:00':NaN,'1900-01-04 00:00':NaN,'1900-01-05 00:00':NaN,'1900-01-06 00:00':NaN,'1900-01-07 00:00':NaN,'1900-01-08 00:00':NaN,'1900-01-09 00:00':NaN,'1900-01-010 00:00':NaN}
  },
  {
  type: "eth",
  value: NaN,
  history:{'1900-01-01 00:00':NaN,'1900-01-02 00:00':NaN,'1900-01-03 00:00':NaN,'1900-01-04 00:00':NaN,'1900-01-05 00:00':NaN,'1900-01-06 00:00':NaN,'1900-01-07 00:00':NaN,'1900-01-08 00:00':NaN,'1900-01-09 00:00':NaN,'1900-01-010 00:00':NaN}
},
  {
  type: "xrp",
  value: NaN,
  history:{'1900-01-01 00:00':NaN,'1900-01-02 00:00':NaN,'1900-01-03 00:00':NaN,'1900-01-04 00:00':NaN,'1900-01-05 00:00':NaN,'1900-01-06 00:00':NaN,'1900-01-07 00:00':NaN,'1900-01-08 00:00':NaN,'1900-01-09 00:00':NaN,'1900-01-010 00:00':NaN}
  }
]
var ethChart;
var btcChart;
var xrpChart;
let history= [{symbol: "NaN", amount: "NaN", type: "NaN", createdAt:"NNaN"}];
var currents = [
    {
        type: "usd",
        label: "Dollár",
        selectable: false
    },
    {
        type: "btc",
        label: "Bitcoin",
        selectable: true
    },
    {
        type: "xrp",
        label: "XRP",
        selectable: true
    },
    {
        type: "eth",
        label: "Etherium",
        selectable: true
    }];

var transactionTypes = [
    {
        label: "vétel",
        type: "buy"
    }
    ,
    {
        label: "eladás",
        type: "sell"
    }];

function hideSite(site) {
    try {
        var x = document.getElementById(site);
        x.style.display = "none";
    } catch (e) {
        console.log(e.message);
    }

}

function showSite(site) {
    try {
        var x = document.getElementById(site);
        sites.forEach(hideSite);
        x.style.display = "Block";
    } catch (e) {
        console.log(e.message);
    }
}


function getStatus() {

    var data = null;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.status != 0 && this.readyState === 4) {
            console.log(this.responseText);
            return this.responseText;
        }
    });
    xhr.open("GET", baseUrl);
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("Access-Control-Allow-Origin", cors);
    xhr.send(data);
}

function getExchangeRate(valuta) {
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
            if (xhr.status != 0 && this.readyState === 4) {
                  var  currentRate = JSON.parse(this.response);
                  try {
                    currentRates.find(obj => obj.type === valuta).value = currentRate.currentRate;
                    currentRates.find(obj => obj.type === valuta).history = currentRate.history;
                  } catch (e) {

                  } finally {
                    updateChart();                  
                });
                  }
            }
        }
    );
    try {
      xhr.open("GET", baseUrl + "/exchange/" + valuta);
      xhr.setRequestHeader("X-Access-Token", apiKey);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Access-Control-Allow-Origin", cors);
      xhr.send(data);
    } catch (e) {

    } finally {
     updateChart();
    }

}

function getBalance() {

    var data = null;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.status != 0 && this.readyState === 4) {
          try {
              balance = JSON.parse(this.response);
          } catch (e) {

          } finally {
            balanceUpdate();
          }

        }
    });
    try {
      xhr.open("GET", baseUrl + "/account");
      xhr.setRequestHeader("X-Access-Token", apiKey);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Access-Control-Allow-Origin", cors);
      xhr.send(data);
     } catch (e) {
    } finally {

    }

}

function getHistory() {

    var data = null;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.status != 0 && xhr.status != 429 && this.readyState === 4) {
          try {
              history = JSON.parse(this.response);
          } catch (e) {

          } finally {
              historyUpdate();
          }
        }
    });
    try {
      xhr.open("GET", baseUrl + "/account/history");
      xhr.setRequestHeader("X-Access-Token", apiKey);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Access-Control-Allow-Origin", cors);
      xhr.send(data);
    } catch (e) {

    } finally {

    }
}

function resetAccount() {
    var data = JSON.stringify(false);
    var xhr = new XMLHttpRequest();


    xhr.addEventListener("readystatechange", function () {
      if (xhr.status != 0 && this.readyState === 4) {
            console.log(this.responseText);
            getBalance();
        }
    });
    try {
      xhr.open("POST", baseUrl + "/account/reset");
      xhr.setRequestHeader("X-Access-Token", apiKey);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Access-Control-Allow-Origin", cors);
      xhr.send(data);
    } catch (e) {

    } finally {

    }
}

function purchase(curent, value) {
    var data = JSON.stringify({
        "Symbol": curent,
        "Amount": value
    });

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.status != 0 && this.readyState === 4 ) {
            console.log(this.responseText);
            try {
                alert(JSON.parse(this.responseText)["Message"]);
            } catch (e) {
                console.log(e.message);
            }
            getBalance();
        }
    });

    try {
      xhr.open("POST", baseUrl + "/account/purchase");
      xhr.setRequestHeader("X-Access-Token", apiKey);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Access-Control-Allow-Origin", cors);
      xhr.send(data);
    } catch (e) {
      alert("no network");
    } finally {

    }

}

function sell(curent, value) {
    var data = JSON.stringify({
        "Symbol": curent,
        "Amount": value
    });

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.status != 0 && this.readyState === 4) {
            console.log(this.responseText);
            try {
                alert(JSON.parse(this.responseText)["Message"]);
            } catch (e) {
                console.log(e.message);
            }
            getBalance();
        }

    });
    try {
      xhr.open("POST", baseUrl + "/account/sell");
      xhr.setRequestHeader("X-Access-Token", apiKey);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Access-Control-Allow-Origin", cors);
      xhr.send(data);
    } catch (e) {

    } finally {

    }
}

function balanceUpdate() {
    for (var i = document.getElementById("balanceTable").rows.length; i > 1; i--) {
        document.getElementById("balanceTable").deleteRow(i - 1);
    }
    var table = document.getElementById("balanceTable");
    currents.forEach(curents => {
        var row = table.insertRow(table.rows.length);
        var cel1 = row.insertCell(0);
        var cel2 = row.insertCell(1);
        cel1.innerHTML = curents.label;
        cel2.innerHTML = balance[curents.type];
    });
}

function historyUpdate() {
    for (var i = document.getElementById("actionHistory").rows.length; i > 1; i--) {
        document.getElementById("actionHistory").deleteRow(i - 1);
    }
    var table = document.getElementById("actionHistory");
    history.forEach(history => {
        if (history.type !== "Reset") {
            var row = table.insertRow(table.rows.length);
            var cel1 = row.insertCell(0);
            var cel2 = row.insertCell(1);
            var cel3 = row.insertCell(2);
            var cel4 = row.insertCell(3);
            cel1.innerHTML = history.type;
            currents.forEach(currents => {
                if (currents.type === history.symbol.toLowerCase()) {
                    cel2.innerHTML = currents.label;
                }
            });
            cel3.innerHTML = history.amount;
            cel4.innerHTML = history.createdAt.substring(1,10);
        }
    });
}

function formUIUpdate() {
    var select = document.getElementById("transactionTypeSelect");
    transactionTypes.forEach(transactionTyps => {

        var el = document.createElement('option');
        el.textContent = transactionTyps.label;
        el.value = transactionTyps.label;
        select.appendChild(el);

    });
    var select = document.getElementById("currentSelect");

    currents.forEach(curents => {
        if (curents.selectable == true) {
            var el = document.createElement('option');
            el.textContent = curents.label;
            el.value = curents.label;
            select.appendChild(el);
        }
    });
}

function onClickTransaction() {

    var tType = transactionTypes[document.getElementById("transactionTypeSelect").selectedIndex].type;
    var TCurent = currents[document.getElementById("currentSelect").selectedIndex + 1].type;
    var Tvalue = document.getElementById("transactionValue").value;
    if (tType === "buy") {
        purchase(TCurent.toUpperCase(), Tvalue);
    } else {
        sell(TCurent.toUpperCase(), Tvalue);
    }

}

function maxValue() {
    var tType = transactionTypes[document.getElementById("transactionTypeSelect").selectedIndex].type;
    var TCurent = currents[document.getElementById("currentSelect").selectedIndex + 1].type;
    var Tvalue = document.getElementById("transactionValue");
    Tvalue.max = balance[TCurent];
    if (tType === "buy") {
        Tvalue.max = balance["usd"] / currentRates.find(obj => obj.type === TCurent).value ;
        console.log(Tvalue.max);
    }
    if(Tvalue.value > Tvalue.max){
        Tvalue.value = 0;
    }
}

function updateCurrents() {
    getBalance();
    getExchangeRate("eth");
    getExchangeRate("btc");
    getExchangeRate("xrp");

}

function init() {
    showSite(startPage);
    getBalance();
    updateCurrents();
    formUIUpdate();
    getHistory();
    setInterval(function() { updateDatas(); }, 15000);

}

function updateDatas() {
    getBalance();
    getExchangeRate("eth");
    getExchangeRate("btc");
    getExchangeRate("xrp");
    getHistory();
    maxValue();

}

function getChartData(jsonData) {

    var keys = [];
    var values = [];
    for (var k in jsonData.history) keys.push(k);
    keys.forEach(keys => {
        values.push(jsonData.history[keys])
    });
    return {keys, values};
}

function updateChart() {
    currentRates.forEach(c =>{
      var chart = c.type + 'Current';
      let cCur = getChartData(c);
        var ctx = document.getElementById(chart).getContext('2d');
        if(window[ c.type+'chart'])  window[c.type+'chart'].destroy();
         window[ c.type+'chart'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cCur.keys,
                datasets: [{
                    label: currents.find(obj => obj.type === c.type).label + " " + c.value + "$",
                    data: cCur.values,
                    backgroundColor: "rgba(54, 162, 235,0.2)",
                    borderColor: "rgba(54, 162, 235,1)",
                    borderWidth: 1
                }]
            }
        });
    });
}
