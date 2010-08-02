(function(){
  var data = {
    "Link - IMDB Top 250": {type: "Link", name: "IMDB Top 250", url: "/chart/top", year:""}, 
  };

  var arr = [], db = localStorage.getItem("imdbac") || "{}";
  db = JSON.parse(db);
  function populateDb() {
    //Top 250 Page
    if(window.location.pathname.indexOf("/chart/top") !== -1) {
      var trArray = $("#root #main table tr");
      $(trArray).each(function(index, ele) {
        if(index) {
          var name = $(ele).find("td").eq(2).find("a").text();          
          var url = $(ele).find("td").eq(2).find("a").attr("href");
          var yearText = $(ele).find("td").eq(2).text();
          var l = yearText.length;
          var year = yearText.substr(l-5, 4);
          insertIntoDb("Movie", name, url, year);
        }
      });
    }
    // Movie Page
    if(window.location.pathname.indexOf("/title/") !== -1) {
      var splt = $("#tn15title h1").text().split(" (");
      var name = splt[0];
      var url = window.location.pathname;
      var year = splt[1].split(")") [0];
      insertIntoDb("Movie", name, url, year);
      
      //Director
      $("#director-info a").each(function(index, node) {
         insertIntoDb("Person", $(node).text(), $(node).attr("href"), null);
      });

      //Cast
      $("#tn15main .cast .nm a").each(function(index, node) {
         insertIntoDb("Person", $(node).text(), $(node).attr("href"), null);
      });
    }
    //Person Page
    if(window.location.pathname.indexOf("/name/") !== -1) {
      var name = $("#tn15title h1").text().split(" More at") [0];
      var url = window.location.pathname;
      insertIntoDb("Person", name, url, null);
    }
  }
  populateDb();
  function insertIntoDb(type, name, url, year) {
    if(!db[type + " - " + name + (year?(" - "+year):"")]) {
      var k = {};
      k[type + " - " + name + (year?(" - "+year):"")] = {
        type: type,
        name: name,
        url: url,
        year: year
      }
      db = $.extend(db, k)
    }
  }
  
  localStorage.setItem("imdbac", JSON.stringify(db));
  db = jQuery.extend(db, data);
  var arr = [];
  $.each(db, function(k, v){
    arr.push(v);
  });
 
  var imdbSearch = $("form input[name=q]");
  imdbSearch.addClass("imdbac");
  imdbSearch.attr("autocomplete", "off");
  imdbSearch.autocomplete(arr, {
    formatMatch: function(item) {
      return item.name
    },
    formatItem: function(item) {
      var y = item.year;
      return item.name + (y?("<span class='acyr'>"+y+"</span>"):"");
    },
    matchContains: true
  }).result(function(event, item) {
    location.href = "http://www.imdb.com" + item.url;
  });
}());
