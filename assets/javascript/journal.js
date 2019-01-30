$(document).on("Click", ".addFood", function () {

    event.preventDefault();

    var food = $(this).attr(".foodInput");
    console.log(this);

    var queryURL = "https://trackapi.nutritionix.com/v2/search/instant?query=" 
    + food

    $.ajax({
        url: queryURL,
        method: "POST", 
        headers: {
            "x-app-id": "0acfbe2a",
            "x-app-key":"5ac36eed774455cd4bb1259966818fce"
            },

        data: $(".foodInput").val().trim(),
        dataType: JSON,


    })
        .then(function(response){
            console.log(response);
        var results = response.data;

        for( var i=0; i<results.length; i++){

        var foodDiv = $("<div>");

            var foodImage= $("<img>");
            foodImage.attr("src", results[i].photo.thumb);

        var carbs = results[i].foods.nf_calories;
        var sugar = results[i].foods.nf_sugars;
        var protein = results[i].foods.nf_proteins;
        
        var p= $("<p>").text("Calories: " + carbs, "Sugars: " + sugar, "Protein: " + protein);
        
        foodDiv.prepend(p);
        foodDiv.prepend(foodImage);

        $(".journal").prepend(foodDiv);
        
        }
    })
});