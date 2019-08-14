
var address;
var url;



var ipCity = "New York";
var ipReg = "New York"
var lat = "40.6305";
var lon = "-73.7783";
var newaddress;


var wS; // wind speed
var wG; // wind gust
var wD; // wind direction
var time;


var curtime = Math.round((new Date()).getTime() / 1000); //unix timestamp

//Finds Weather for any given Lat/lon Darksky
function findWeather() {
  url = "https://api.darksky.net/forecast/d5d98e87f7b5cfc3cacc4f0539238087/"+lat+","+lon+"?exclude=minutely,hourly,alerts,flags";
  // Dark Sky
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function (pdata) {
        
        

        var cG = pdata.currently.windGust;
        var cB = pdata.currently.windBearing;

        var wData = pdata.daily.data;
        
        console.log(pdata);
        var numBad = 0;
        for (var i = 0; i < wData.length; i++){

          var section = "<section id='section"+i+"'>";
          
          time = wData[i].time * 1000;
          //var nowD = time.format("mediumDate");
          var date = new Date(time);
          var nowD = date.format("fullDate");
          section += "<p id='date"+i+"'>"+nowD+"</p>";

          
          wG = wData[i].windGust;
          wD = wData[i].windBearing;
          
          /** if using current?
          if (i==0){
            if (cG > wG){ // if curr Gust is greater than daily forecast on day 1 onlye\
              wG = cG; 
              wD = cB;
            }
          }
          **/

          wG = Math.round(wG * 0.868976);
          section += "<p class='more'>Wind gusts of "+wG+" knots at ";

          
          wD = wD + 13; //correction for magnetic/true
          if(wD > 360){
            wD = wD - 360;
          }
          section += wD +"&#176;";


          var b = wD / 10;
          var off;
          if(b > 4 && b < 22){off = 13;}
          else{off=31;}

          var tri = Math.abs(b - off) * 10;
          tri = Math.round(tri);
          //section += "<p>"+tri+" deg offset</p>";

          tri = tri * ( Math.PI / 180) ;
          

          var component = Math.cos(tri) * wG;
          component = Math.round(component);

          

          section += " result in a "+component+" knot crosswind.</p>";
          
          
          section += "</section><br>";
          $('#content').append(section); // temp

          var id = "date"+i;
          var id2 = "section"+i;
          if(component >= 30){
            $('#'+id).addClass('bad'); // temp    
            $('#'+id2).addClass('bad'); // temp 
            numBad++;           
          }
          else if (component >= 20 && component < 30){
            $('#'+id).addClass('mbad'); // temp    
            $('#'+id2).addClass('mbad'); // temp            
            numBad++
          }
        }

        if(numBad ==0){
          $('#key').append("<p class='alert'><em>No problematic days expected for the next 8 days</em></p>")
        }
      
    }
  });	
  
}



//Date Stuff

var now = new Date();

// You can use one of several named masks
/**
var nowD = now.format("mediumDate");
var nowT = now.format("shortTime");
**/

// Once ajax is complete, create some HTML
$(document).ready(function() {
  $("#content").addClass('in');
  findWeather();
  
});

