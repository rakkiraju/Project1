$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDG1lEd_nZKUJ_FmKSkn0CaH0jYO0tOdbE",
        authDomain: "nutrition-app-a8a1f.firebaseapp.com",
        databaseURL: "https://nutrition-app-a8a1f.firebaseio.com",
        projectId: "nutrition-app-a8a1f",
        storageBucket: "",
        messagingSenderId: "1045472959660"
    };

    firebase.initializeApp(config);

    var dataRef = firebase.database();

    var userId = "";
    var height = "";
    var userWeight = "";
    var userAge = "";
    var workOut = "";

    $("#addUser").on("click", function (event) {
        event.preventDefault();

        var userId = $("#nameInput").val().trim();
        var userHeight = $("#heightInput").val().trim();
        var userWeight = $("#weightInput").val().trim();
        var userAge = $("#ageInput").val().trim();
        var workOut = $("#wkInput").val().trim();

        var newUser = {

            name: userId,
            height: userHeight,
            weight: userWeight,
            age: userAge,
            workOutRoutine: workOut,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };
        
        dataRef.ref().push(newUser);

        console.log(newUser.name);
        console.log(newUser.height);
        console.log(newUser.weight);
        console.log(newUser.age);
        console.log(newUser.workOutRoutine);
    })

    $("#nameInput").val("");
    $("#heightInput").val("");
    $("#weightInput").val("");
    $("#ageInput").val("");
    $("#wkInput").val("");




})