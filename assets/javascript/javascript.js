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
var trainName = "";
var destination = "";
var firstTrainTime;
var frequency = "";
var currentTime = moment(currentTime).format("hh:mm");

//empty text areas (to overide bootstrap defaults that prevent text from left-aligning)
$(".inputBox").val("");

// Whenever a user clicks the click button
$("#submit").on("click", function (event) {
  event.preventDefault();
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#firstTrainTime").val().trim();
  frequency = $("#frequency").val().trim();


  // Save new value to Firebase
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  });

  //empty text areas (to manually clear text, otherwise prevented by event.preventDefault)
  $(".inputBox").val("");

});

// At the initial load and on subsequent data value changes, get a snapshot of the current data. 
// This callback keeps the page updated when a value changes in firebase.
database.ref().on("child_added", function (childSnapshot) {

  // Console.log the "snapshot" value (a point-in-time representation of the database)
  console.log(childSnapshot.val());
  // This "snapshot" allows the page to get the most current values in firebase.

  // Change the vars to match the value in the database
  trainName = childSnapshot.val().trainName;
  destination = childSnapshot.val().destination;
  firstTrainTime = childSnapshot.val().firstTrainTime;
  frequency = childSnapshot.val().frequency;

  //calculate times
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTrainTimeConverted);

  // Current Time
  console.log("CURRENT TIME: " + currentTime);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");

  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log("tRemainder: " + tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrainTime = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("hh:mm"));

  // Console Log the values
  trainID = childSnapshot.key
  console.log("trainID: " + childSnapshot.key);
  console.log("trainName: " + childSnapshot.val().trainName);
  console.log("destination: " + childSnapshot.val().destination);
  console.log("firstTrainTime: " + childSnapshot.val().firstTrainTime);
  console.log("freqency: " + childSnapshot.val().frequency);
  console.log("nextTrainTime: " + nextTrainTime)
  console.log("-------- END OF TRAIN INFO --------")

  // Change the HTML using jQuery to reflect the updated values
  var newTableRow = $("#trainInfo").append(
    "<tr>",
    "<td>" + childSnapshot.val().trainName + "</td>",
    "<td>" + childSnapshot.val().destination + "</td>",
    "<td>" + childSnapshot.val().frequency + "</td>",
    "<td>" + moment(nextTrainTime).format("HH:mm") + "</td>",
    "<td>" + tMinutesTillTrain + "</td>",
  );

  // Change the HTML using jQuery to reflect the updated values
  $("#submit").push(newTableRow)
  // Alternate solution to the above line
  // $("#click-value").html(clickCounter);

  // If any errors are experienced, log them to console.
},
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  