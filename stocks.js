var stocks = [];
var data_array = [['Stock Symbol', 'latestPrice',{ role: 'annotation' }]];
var stocks_to_display = '';

//This function adds new stock symbol in the stocks array
function add_stock_symbol()
{
    var new_stock = document.getElementById("stock_name").value;
    document.getElementById("stock_name").value = "";
    new_stock = new_stock.toUpperCase();
    for(var i=0; i<stocks.length; i++)
    {
        if(stocks[i] == new_stock)
        {
            alert('Stock symbol ' + new_stock + ' already added in the chart!');
            return;
        }
    }
    update_graph(new_stock, "new");
}

//This function fetches data from the stocks api and stores it in data array, then calls draw_chart()
function update_graph(new_stock, type)
{	
    var url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+ new_stock + '&types=quote&filter=latestPrice';	
    
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson){

        if(type == "new")
        {
            if(myJson[new_stock]==null)
                alert('invalid Stock symbol ' + new_stock + '!');
            else
                add_new_stock_price(new_stock, myJson);
        }
        else
            add_updated_prices(myJson);
        
        draw_chart();
    });
}

function add_new_stock_price(new_stock, myJson)
{
    stocks.push(new_stock);
    stocks_to_display += "<li>" + new_stock + "</li>";
    document.getElementById("display_stock_names").innerHTML =  stocks_to_display;
    
    var temp = [];	
    temp.push(new_stock);
    temp.push(myJson[new_stock]["quote"]["latestPrice"]);
    temp.push(myJson[new_stock]["quote"]["latestPrice"]);
    data_array.push(temp);
}

function add_updated_prices(myJson)
{
    data_array = [['Stock Symbol', 'latestPrice',{ role: 'annotation' }]];
    for(var i=0; i<stocks.length; i++)
    {
        var temp = [];
        temp.push(stocks[i]);
        temp.push(myJson[stocks[i]]["quote"]["latestPrice"]);
        temp.push(myJson[stocks[i]]["quote"]["latestPrice"]);
        data_array.push(temp);
    }
}

//Visualizes data array using Google chart
function draw_chart()
{
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawBasic);
    
    function drawBasic() 
    {
        var data = google.visualization.arrayToDataTable(data_array);
        var options = {
            title: 'Stock Prices',
            chartArea: {width: '50%'},
            hAxis: {
            title: 'Price',
            minValue: 0
            }
        };
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
}

//This function updates the data array after every 5 seconds
setInterval(function() 
{
    if(stocks.length==0)
        return;
    join_stock_symbols = stocks.join(',');    
    update_graph(join_stock_symbols, "update");
}, 5000);

document.getElementById("stock_form").onkeypress = function(e) {
    var key = e.charCode || e.keyCode || 0;     
    if (key == 13) {
      e.preventDefault();
      add_stock_symbol();
    }
  }