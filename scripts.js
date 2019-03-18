var baseUrl = "https://obudai-api.azurewebsites.net/api";
var apiKey = "3D2ADF61-84D2-42A2-A715-A207B67A8CD8";
var sites = ["main", "transactions", "settings"];
var startPage = "main";
var balance;
var currentRateEth;
var currentRateBtc;
var currentRateXrp;
var myChart1;
var myChart2;
var myChart3;
let history;
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
        if (this.readyState === 4) {
            console.log(this.responseText);
            return this.responseText;
        }
    });
    xhr.open("GET", baseUrl);
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
}

function getExchangeRate(valuta) {

    var data = null;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (valuta === "eth") {
                    currentRateEth = JSON.parse(this.response);
                } else if (valuta === "btc") {
                    currentRateBtc = JSON.parse(this.response);
                } else if (valuta === "xrp") {
                    currentRateXrp = JSON.parse(this.response);
                }
                if (currentRateXrp !== null && currentRateEth !== null && currentRateBtc !== null) {
                    updateChart();
                }
            }

        }
    );
    xhr.open("GET", baseUrl + "/exchange/" + valuta);
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);

}

function getBalance() {

    var data = null;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            balance = JSON.parse(this.response);
            balanceUpdate();
        }
    });
    xhr.open("GET", baseUrl + "/account");
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
}

function getHistory() {

    var data = null;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            history = JSON.parse(this.response);
            historyUpdate();
        }
    });
    xhr.open("GET", baseUrl + "/account/history");
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
}

function resetAccount() {
    var data = JSON.stringify(false);
    var xhr = new XMLHttpRequest();


    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            getBalance();
        }
    });
    xhr.open("POST", baseUrl + "/account/reset");
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
}

function purchase(curent, value) {
    var data = JSON.stringify({
        "Symbol": curent,
        "Amount": value
    });

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            try {
                alert(JSON.parse(this.responseText)["Message"]);
            } catch (e) {
                console.log(e.message);
            }
            getBalance();
        }
    });

    xhr.open("POST", baseUrl + "/account/purchase");
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);

}

function sell(curent, value) {
    var data = JSON.stringify({
        "Symbol": curent,
        "Amount": value
    });

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            try {
                alert(JSON.parse(this.responseText)["Message"]);
            } catch (e) {
                console.log(e.message);
            }
            getBalance();
        }

    });
    xhr.open("POST", baseUrl + "/account/sell");
    xhr.setRequestHeader("X-Access-Token", apiKey);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
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
    var TCurent = currents[document.getElementById("currentSelect").selectedIndex].type;
    var Tvalue = document.getElementById("transactionValue");
    Tvalue.max = balance[TCurent];
    Tvalue.value = 0;
    if (tType === "buy") {
        Tvalue.max = 100;
    }
}

function updateCurrents() {
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
    setInterval(function() { updateDatas(); }, 10000);
}

function updateDatas() {
    getBalance();
    getExchangeRate("eth");
    getExchangeRate("btc");
    getExchangeRate("xrp");
    getHistory();

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
    let eth = getChartData(currentRateEth);
    let btc = getChartData(currentRateBtc);
    let xrp = getChartData(currentRateXrp);

    var ctx = document.getElementById('ethCurrent').getContext('2d');
    if(myChart1) myChart1.destroy();
     myChart1 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: eth.keys,
            datasets: [{
                label: 'Etheriumnak: ' + currentRateEth.currentRate + "$",
                data: eth.values,
                backgroundColor: 'rgba(100, 159, 64, 0.2)',
                borderColor: 'rgba(100, 99, 132, 1)',
                borderWidth: 1
            }]
        }


    });

    var ctx = document.getElementById('btcCurrent').getContext('2d');
    if(myChart2) myChart2.destroy();
     myChart2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: btc.keys,
            datasets: [{
                label: 'Bitcoin: ' + currentRateBtc.currentRate + "$",
                data: btc.values,
                backgroundColor: 'rgba(100, 159, 64, 0.2)',
                borderColor: 'rgba(100, 99, 132, 1)',
                borderWidth: 1
            }]
        }


    });

    var ctx = document.getElementById('xrpCurrent').getContext('2d');
    if(myChart3) myChart3.destroy();
    myChart3 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xrp.keys,
            datasets: [{
                label: 'XRP: ' + currentRateXrp.currentRate + "$",
                data: xrp.values,
                backgroundColor: 'rgba(100, 159, 64, 0.2)',
                borderColor: 'rgba(100, 99, 132, 1)',
                borderWidth: 1
            }]
        }


    });

}