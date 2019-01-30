$(document).ready(function () {


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

    var userId = "";
    var height = "";
    var userWeight = "";
    var userGender = "";
    var userAge = "";
    var workOut = "";

    $("#onSubmit").on("click", function (event) {
        console.log("Came here!!!!");
        event.preventDefault();

        var userId = $("#userId").val();
        // console.log(userId);
        var userName = $("#name").val();
        var userHeightFt = $("#cheightfeet").val();
        var userHeightIn = $("#cheightinch").val();
        var userHeight = (parseInt(userHeightFt) * 12 ) + parseInt( userHeightIn);
        var userWeight = $("#weight").val();
        // is female?
        var userGender = "";
        var radioVal = document.getElementsByName('gender');

        console.log("radio button lengths are " + radioVal.length);

        for (var i = 0, length = radioVal.length; i < length; i++)
        {
            if (radioVal[i].checked)
            {
                // do whatever you want with the checked radio
                // alert(radioVal[i].id);
                userGender = radioVal[i].id;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        
        var userAge = $("#age").val();
        //var workOut = $("#wkInput").val();

        //calculate recomended weekly protein intake
        //formulae is 1.3 * (weight in Kgs)
        var iweeklyProtein = 1.3 * (userWeight/2.205);

        // calculate recomended weekly sugars intake
        //formaule is based on AHA standards -> 37.58g (Men) 25g (Female)

        
        //formulae for calorie intake is -> 
        //Revised Harris-Benedict Equation: (source -> https://www.calculator.net/calorie-calculator.html)
        // For men:
        // BMR = 13.397W + 4.799H - 5.677A + 88.362
        // For women:
        // BMR = 9.247W + 3.098H - 4.330A + 447.593
        // where:
        // W is body weight in kg
        // H is body height in cm
        // A is age
        // F is body fat in percentage

        var iweeklySugars = 0;
        var iWeeklyCalories = 0;
        if(userGender === "male")
        {
            iweeklySugars = 37.58 * 7;
            iWeeklyCalories = (13.397 * (userWeight/2.205)) + (4.799 * (2.54 * userHeight)) - (5.677 * userAge) + 88.362;
        }
        else
        {
            iweeklySugars = 25 * 7;
            iWeeklyCalories = (9.24 * (userWeight/2.205)) + (3.098 * (2.54 * userHeight)) - (4.330 * userAge) + 447.593;
        }

        //calculate weekly carbs intake
        //formulae = 45% of weekly calorie intake
        var iWeeklyCarbs = .45 * iWeeklyCalories;

        

        var newUser = {

            name: userName,
            height: userHeight,
            weight: userWeight,
            age: userAge,
            gender: userGender,
            key: userId,
            carbs: (iWeeklyCarbs * 7),
            sugars: (iweeklySugars * 7),
            protein: (iweeklyProtein * 7),
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };

        console.log(newUser.name);
        console.log(newUser.height);
        console.log(newUser.weight);
        console.log(newUser.gender);
        console.log(newUser.age);
        console.log(newUser.key);

        dataRef.ref().push(newUser);

        
        // console.log(newUser.workOutRoutine);

    });

    function login() {




    };



})
