$(document).on("click", ".addFood", function () {

    event.preventDefault();

    var food = $(".foodInput").val().trim();
    console.log(food);

    var queryURL = "https://trackapi.nutritionix.com/v2/natural/nutrients" 
    

    $.ajax({
        url: queryURL,
        method: "POST", 
        headers: {
            "x-app-id": "0acfbe2a",
            "x-app-key":"5ac36eed774455cd4bb1259966818fce",
            "Content-Type":"application/json"
            },
        data:JSON.stringify({   
        "query": food,
        "timezone": "US/Eastern",
        
        
        })

    })
        .then(function(response){
            console.log(response);
        var results = response.foods;
            console.log(results);
       

        var foodDiv = $("<div>");

            var foodImage= $("<img>");
            //foodImage.attr("src", results[0].photo.thumb);

        var carbs = results[0].nf_calories;
        var sugar = results[0].nf_sugars;
        var protein = results[0].nf_protein;
       
        console.log(carbs);
        console.log(sugar);
        console.log(protein);


        var p= $("<p>").text("Calories: " + carbs, "Sugars: " + sugar, "Protein: " + protein);
        
        foodDiv.prepend(p);
        foodDiv.prepend(foodImage);

        $("#journal").prepend(foodDiv);
        $(".foodInput").val("");


        var newRow= $('<tr>').append(
            $("<td>").text(food),
            $("<td>").text(carbs),
            $("<td>").text(protein),
            $("<td>").text(sugar)
           

        );

        $("#journalTable").append(newRow);
    })
});