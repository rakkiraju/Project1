$(document).ready(function(){
console.log("ready");
var mealTime = "";
var dayChosen = "";
var key=localStorage.getItem("app-userID");

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
    var DBkey = snapshot.val().key;
    if(DBkey == key)
    {
        var food = snapshot.val().foodItem;
        var day = snapshot.val().day;
        var meal = snapshot.val().meal;
        var carbs = snapshot.val().carbs;
        var protein = snapshot.val().protein;
        var sugar = snapshot.val().sugar;
    
        var newRow = $('<tr>').append(
            $("<td>").text(food),
            $("<td>").text(day),
            $("<td>").text(meal),
            $("<td>").text(carbs + " grams"),
            $("<td>").text(protein + " grams"),
            $("<td>").text(sugar + " grams")


        );

        $("#journalTable").append(newRow);
    }
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$(document).on("click", ".addFood", function () {

    event.preventDefault();

    var food = $(".foodInput").val().trim();
    console.log(food);
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
            console.log(response);
            var results = response.foods;
            console.log(results);

            var day = dayChosen;
            var meal = mealTime;
            var carbs = results[0].nf_total_carbohydrate;
            var sugar = results[0].nf_sugars;
            var protein = results[0].nf_protein;

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
        console.log(mealTime);
    });

    $("select.day").on('change', function () {
        dayChosen = $(this).children("option:selected").val();
        console.log(dayChosen);
    });
    // var myUserId = localStorage.getItem("app-userID");
    var wsRef = dataRef.ref("weeklyStandards");
    wsRef.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            console.log("The DB value is " + data.val().key);
            if(data.val().key == key)
            {
                var carbs1Val = $("#myTable1 #carbs1").text();
                var carbs = data.val().carbs;
                var iCarbs = Math.ceil(parseInt(carbs));
                var protein = data.val().protein;
                var iProtein = Math.ceil(parseInt(protein));
                var sugars = data.val().sugars;
                var iSugars = Math.ceil(parseInt(sugars));
                $("#myTable1 #Carbs2").text(iCarbs);
                $("#myTable1 #sugar2").text(iSugars);
                $("#myTable1 #protein2").text(iProtein);
 
            }
        });
 
      });
      
      
});


