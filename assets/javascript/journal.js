$(document).ready(function(){
//console.log("ready");
var mealTime = "";
var dayChosen = "";
var key=localStorage.getItem("app-userID");
var iCarbsTotal = 0;
var iSugarsTotal = 0;
var iProteinTotal = 0;
var bWentIn = false;
var iCarbs = 0;
var iProtein = 0;
var iSugars = 0;
var iTempCarbsTotal  = 0;
var iTempSugarsTotal  = 0;
var iTempProteinTotal  = 0;
var cBarChart;

var config = {
    apiKey: "AIzaSyDG1lEd_nZKUJ_FmKSkn0CaH0jYO0tOdbE",
    authDomain: "nutrition-app-a8a1f.firebaseapp.com",
    databaseURL: "https://nutrition-app-a8a1f.firebaseio.com",
    projectId: "nutrition-app-a8a1f",
    storageBucket: "nutrition-app-a8a1f.appspot.com",
    messagingSenderId: "1045472959660"
  };

firebase.initializeApp(config);

var dataRef = firebase.database();

dataRef.ref("dailyItems").on("child_added", function(snapshot) {
    //delete the Totals TR
    $("#totalsRow").remove();
    var DBkey = snapshot.val().key;
    if(DBkey == key)
    {
        var food = snapshot.val().foodItem;
        var day = snapshot.val().day;
        var meal = snapshot.val().meal;
        var carbs = snapshot.val().carbs;
        var protein = snapshot.val().protein;
        var sugar = snapshot.val().sugar;
        
        bWentIn  = true;
        var newRow = $('<tr>').append(
            $("<td>").text(food),
            $("<td>").text(day),
            $("<td>").text(meal),
            $("<td>").text(carbs + " grams"),
            $("<td>").text(sugar + " grams"),
            $("<td>").text(protein + " grams")          
        );

        $("#journalTable").append(newRow);
        //console.log("iCarbs is " + iCarbs);
        cBarChart.data.datasets[0].data = [$("#myTable1 #Carbs2").text(), $("#myTable1 #sugar2").text(), $("#myTable1 #protein2").text()];
        cBarChart.update();
    }
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#signOut").on("click", function(){

    event.preventDefault();
    window.location.href = "mainPage.html";

});

$(document).on("click", ".addFood", function () {

    event.preventDefault();

    var food = $(".foodInput").val().trim();
    //console.log(food);
    // localStorage.setItem("Food-Item", food);

    var queryURL = "https://trackapi.nutritionix.com/v2/natural/nutrients"

    $.ajax({
        url: queryURL,
        method: "POST",
        headers: {
            "x-app-id": "0acfbe2a",
            "x-app-key": "5ac36eed774455cd4bb1259966818fce",
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "query": food,
            "timezone": "US/Eastern",


        })

    })
        .then(function (response) {
            //console.log(response);
            var results = response.foods;
            //console.log(results);

            var day = dayChosen;
            var meal = mealTime;
            var carbs = results[0].nf_total_carbohydrate;
            if(carbs==null){
               carbs="0"
            };
            var sugar = results[0].nf_sugars;
            if(sugar==null){
                sugar="0"
            };
            var protein = results[0].nf_protein;
            if(protein ==null){
                protein="0"
            };

            var newItem={
                key:key,
                foodItem:food,
                day:day,
                meal:meal,
                carbs:carbs,
                sugar:sugar,
                protein:protein,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            };

            dataRef.ref("dailyItems").push(newItem);
        })

});



    $("select.meal").on('change', function () {
        mealTime = $(this).children("option:selected").val();
        //console.log(mealTime);
    });

    $("select.day").on('change', function () {
        dayChosen = $(this).children("option:selected").val();
        //console.log(dayChosen);
    });
    // var myUserId = localStorage.getItem("app-userID");
    var wsRef = dataRef.ref("weeklyStandards");
    wsRef.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            //console.log("The DB value is " + data.val().key);
            if(data.val().key == key)
            {
                var carbs1Val = $("#myTable1 #carbs1").text();
                var carbs = data.val().carbs;
                iCarbs = Math.ceil(parseInt(carbs));
                var protein = data.val().protein;
                iProtein = Math.ceil(parseInt(protein));
                var sugars = data.val().sugars;
                iSugars = Math.ceil(parseInt(sugars));
                $("#myTable1 #Carbs2").text(iCarbs);
                $("#myTable1 #sugar2").text(iSugars);
                $("#myTable1 #protein2").text(iProtein);

                //update the bar graph
                // console.log("Calling to update graph!!!");
                //cBarChart.clear();
                // console.log("bbbb " + $("#myTable1 #Carbs2").text());

                cBarChart.data.datasets[0].data = [$("#myTable1 #Carbs2").text(), $("#myTable1 #sugar2").text(), $("#myTable1 #protein2").text()];
                //cBarChart.data.datasets[1].data = [iTempCarbsTotal, iTempSugarsTotal, iTempProteinTotal];
                cBarChart.update();
 
            }
        });
 
      });

      var diRef = dataRef.ref("dailyItems");
      diRef.orderByValue().on("value", function(snapshot) {
        iCarbsTotal = 0;
        iSugarsTotal = 0;
        iProteinTotal = 0;
          snapshot.forEach(function(data) {
              //console.log("The DB value is " + data.val().key);
              if(data.val().key == key)
              {
                if(isNumber(data.val().carbs))
                {
                    iCarbsTotal += parseFloat( data.val().carbs );
                }
                if(isNumber(data.val().sugar))
                {
                    iSugarsTotal += parseFloat( data.val().sugar);
                }
                if(isNumber(data.val().protein))
                {
                    iProteinTotal += parseFloat( data.val().protein );   
                }
              }
          });
          //console.log("Came to dailyItems loop!!!");
          if(bWentIn)
          {
            //parseFloat(Math.round(num3 * 100) / 100).toFixed(2);
            var iTempCarbsTotal  = parseFloat(Math.round(iCarbsTotal * 100) / 100).toFixed(2);
            var iTempSugarsTotal  = parseFloat(Math.round(iSugarsTotal * 100) / 100).toFixed(2);
            var iTempProteinTotal  = parseFloat(Math.round(iProteinTotal * 100) / 100).toFixed(2);

            var newTotalRow = $('<tr id="totalsRow">').append(
                $("<td>").text(""),
                $("<td>").text(""),
                $("<td>").html("<b>Totals:</b>"),
                $("<td>").html("<b>" + iTempCarbsTotal + " grams </b>"),
                $("<td>").html("<b>" + iTempSugarsTotal + " grams </b>"),
                $("<td>").html("<b>" + iTempProteinTotal + " grams </b>")                
            );
        
                $("#journalTable").append(newTotalRow);
                bWentIn = false;
                console.log("iCarbs is " + iCarbs);

                //cBarChart.remove();
                cBarChart.data.datasets[1].data = [iTempCarbsTotal, iTempSugarsTotal, iTempProteinTotal];
                cBarChart.update();
          }
          else
          {
            iCarbsTotal = 0;
            iSugarsTotal = 0;
            iProteinTotal = 0;
          }
   
        });
      

        //chart functions
        var myTempVal = 1800;
        console.log("myTempVal is " + myTempVal);
        //console.log("my table value is " + $("#myTable1 #Carbs2").text());
        cBarChart = new Chart(document.getElementById("bar-chart-grouped"), {
            type: 'bar',
            data: {
              labels: ["Carbs", "Sugars", "Protein"],
              datasets: [
                {
                  label: "Goals",
                  backgroundColor: "#3e95cd",
                  data: []
                }, {
                  label: "Actual Consumption",
                  backgroundColor: "#8e5ea2",
                  data: []
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: 'Nutrition consumption Chart (grams)'
              }
            }
        });

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
          }
        


});






