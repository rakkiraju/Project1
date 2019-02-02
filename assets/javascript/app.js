$(document).ready(function () {

    // console.log("this is " + $(this));

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

    $("#onSignUp").on("click", function (event) {
        event.preventDefault();
        window.location.href = "loginPage.html";
    });

    $("#onSignIn").on("click", function (event) {
        event.preventDefault();
        //first get the value the user entered
        console.log("came in here!!");
        var tempUID = $("#userEmail").val();//text();
        tempUID = tempUID.toLowerCase();
        var bFoundUser = false;
        //loop through the firebase userData container
        var udRef = dataRef.ref("weeklyStandards");
        udRef.orderByValue().on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                console.log("The DB value is " + data.val().key);
                var fbKey = data.val().key;
                fbKey = fbKey.toLowerCase();
                if(fbKey == tempUID)
                {
                    //localStorage.getItem("app-userID");
                    localStorage.setItem("app-userID", tempUID);
                    window.location.href = "journal.html";  
                    bFoundUser  = true;
                }
            //   console.log("The " + data.key + "  " + data.val().name + "---" + data.val().start);
            });
            
          });
          if(!bFoundUser)
          {
            var $errorMsg = $("<p>").text("User email address not found! Please sign up");
            $($errorMsg).css({'color' : 'red','font-weight' : 'bold'});
            $("#userError").html($errorMsg);
          }
          
    });
    
    $("#onSignOut").on("click", function (event) {
        event.preventDefault();
        localStorage.removeItem('app-userID'); 
        window.location.href = "loginPage.html";
    });

    $("#onSubmit").on("click", function (event) {
        console.log("Came here!!!!");
        event.preventDefault();

        //store the userID
        var userId = $("#userId").val();
        userId = userId.toLowerCase();
        localStorage.setItem("app-userID", userId);

        // console.log(userId);
        var userName = $("#name").val();
        var userHeightFt = $("#cheightfeet").val();
        var userHeightIn = $("#cheightinch").val();
        var userHeight = (parseInt(userHeightFt) * 12 ) + parseInt( userHeightIn);
        var userWeight = $("#weight").val();
        var userGender = "";
        var radioVal = document.getElementsByName('gender');

        // console.log("radio button lengths are " + radioVal.length);

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
        //http://sugarscience.ucsf.edu/the-growing-concern-of-overconsumption.html#.XFRb789Kh24
        
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
            iweeklySugars = 37.58;
            iWeeklyCalories = (13.397 * (userWeight/2.205)) + (4.799 * (2.54 * userHeight)) - (5.677 * userAge) + 88.362;
        }
        else
        {
            iweeklySugars = 25;
            iWeeklyCalories = (9.24 * (userWeight/2.205)) + (3.098 * (2.54 * userHeight)) - (4.330 * userAge) + 447.593;
        }

        //calculate weekly carbs intake
        //formulae = 45% of weekly calorie intake divided by 4.
        //https://healthyeating.sfgate.com/recommended-amount-percent-carbohydrates-per-day-7287.html

        var iWeeklyCarbs = (.45 * iWeeklyCalories)/4;

        var weeklyStandards = {
            key: userId,
            carbs: (iWeeklyCarbs * 7),
            sugars: (iweeklySugars * 7),
            protein: (iweeklyProtein * 7)
        }
        

        var newUser = {

            name: userName,
            height: userHeight,
            weight: userWeight,
            age: userAge,
            gender: userGender,
            key: userId,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };

        //add user data to userData table
        dataRef.ref("userData").push(newUser);

        //add weekly intake standards to weeklyStandards table
        dataRef.ref("weeklyStandards").push(weeklyStandards);

        //launch the journal.html
        window.location.href = "journal.html";
    });

    //get the db values to populate the table
    //console.log("Came to app.js !!!!");
    var myUserId = localStorage.getItem("app-userID");
    //console.log("my userID from LocalStorage is " + myUserId);
    var wsRef = dataRef.ref("weeklyStandards");
    wsRef.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            //console.log("The DB value is " + data.val().key);
            if(data.val().key == myUserId)
            {
                var carbs1Val = $("#myTable1 #carbs1").text();
                //console.log("Came here " + data.val().key + " " + myUserId + "A" + carbs1Val + "B");
                var carbs = data.val().carbs;
                var iCarbs = Math.ceil(parseInt(carbs));
                var protein = data.val().protein;
                var iProtein = Math.ceil(parseInt(protein));
                var sugars = data.val().sugars;
                var iSugars = Math.ceil(parseInt(sugars));
                $("#myTable1 #carbs2").text(iCarbs);
                $("#myTable1 #sugar2").text(iSugars);
                $("#myTable1 #protein2").text(iProtein);
                
            }
        //   console.log("The " + data.key + "  " + data.val().name + "---" + data.val().start);
        });
        
      });


})



