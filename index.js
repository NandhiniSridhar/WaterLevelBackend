//hello
// index.js
// This is our main server file

// include express
const express = require("express");
const fetch = require("cross-fetch");
// create object to interface with express
const app = express();

const bodyParser = require('body-parser');

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

//Reservoirs (name-id-total capacity):
//Shasta-SHA-4552000, Oroville-ORO-3537577, Trinity Lake-CLE-2447650, 
//New Melones-NML-2400000, San Luis-SNL?-2041000, 
//Don Pedro-DNP-2030000, Berryessa-BER-1602000
app.get("/query/getChart", async function(req, res, next){
  console.log("in getChart");
  let water = await lookupWaterData();
  console.log("]")
  //console.log(water);  
  res.json(water);
});

app.use(bodyParser.json());

app.post("/query/postChart", async function(req, res, next){

  console.log(typeof(req.body));
  year = req.body.sendYear;
  month = req.body.sendMonth;
  if(month < 10){
    month = "0"+month;
    console.log(month);
  }
  let resp = await lookupDatedWaterData(month, year);
  console.log(resp);
  res.json(resp);
  
})

/*app.post("query/postChartVals", async function(req, res, next){
  console.log("in postChart");
  console.log(req.body)
  let water = await lookupWaterData();
  res.json(water);
});*/

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({ msg: "No such AJAX request" })
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});



//API function
async function lookupWaterData() {
  const api_url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=D&Start=2021-01-01&End=2021-01-01";
  // send it off
  let fetchResponse = await fetch(api_url);
  let data = await fetchResponse.json()
  return data;
}

async function lookupDatedWaterData(month, year) {
  let url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&dur_code=D&SensorNums=15&Start="+year+"-"+month+"-01&End="+year+"-"+month+"-01"
  //const api_url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&Start=2021-01-01&End=2021-01-01";
  // send it off
  console.log(url)
  let fetchResponse = await fetch(url);
  let data = await fetchResponse.json()
  return data;
}
