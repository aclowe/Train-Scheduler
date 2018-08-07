// Initialize Firebase
  var config = {
    apiKey: "AIzaSyC4GBjUcibtHSaScddE2YdCRbpyrQ5ZZdM",
    authDomain: "train-scheduler-4b423.firebaseapp.com",
    databaseURL: "https://train-scheduler-4b423.firebaseio.com",
    projectId: "train-scheduler-4b423",
    storageBucket: "train-scheduler-4b423.appspot.com",
    messagingSenderId: "702555711461"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
var trainID= 0
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";

  // Whenever a user clicks the click button
$("#submit").on("click", function() {
    trainID++;
    trainName = $("#trainName").val();
    destination = $("#destination").val();
    firstTrainTime = $("#firstTrainTime").val();
    frequency = $("#frequency").val();
    

    // Save new value to Firebase
    database.ref().push({
        trainID: trainID,
        trainName:  trainName,
        destination: destination,
        firstTrainTime:  firstTrainTime,
        frequency: frequency,
    });
  
  });

  // At the initial load and on subsequent data value changes, get a snapshot of the current data. 
// This callback keeps the page updated when a value changes in firebase.
database.ref().on("value", function(snapshot) {
  
    // Console.log the "snapshot" value (a point-in-time representation of the database)
    console.log(snapshot.val());
    // This "snapshot" allows the page to get the most current values in firebase.
  
    // Change the value of our clickCounter to match the value in the database
    trainID = snapshot.val().key;
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrainTime = snapshot.val().firstTrainTime;
    frequency = snapshot.val().frequency;
  
    // Console Log the values
    console.log("trainID: "  + trainID);
    console.log("trainName: " + trainName);
    console.log("destination: " + destination);
    console.log("firstTrainTime: " + firstTrainTime);
    console.log("freqency: " + frequency);
  
    // Change the HTML using jQuery to reflect the updated values
    var newTableRow = $("#trainInfo").append("<tr>")
    newTableRow.append("<td><div class='form-check'><input class='form-check-input' type='checkbox' value='' id='defaultCheck1 delete'></div></td>");
    newTableRow.append("<td>" + trainID + "</td>");
    newTableRow.append("<td>" + trainName + "</td>");
    newTableRow.append("<td>" + destination + "</td>");
    newTableRow.append("<td>" + firstTrainTime + "</td>");
    newTableRow.append("<td>" + frequency + "</td>");

    // Change the HTML using jQuery to reflect the updated values
    $("#submit").push(newTableRow)
    // Alternate solution to the above line
    // $("#click-value").html(clickCounter);
  
  // If any errors are experienced, log them to console.
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  