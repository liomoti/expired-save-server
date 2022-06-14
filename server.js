var admin = require("firebase-admin");

const schedule = require('node-schedule');
var serviceAccount = require("./exdate-92f9d-firebase-adminsdk-320ph-601c17a07e.json");
let User = require('./username.js');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://exdate-92f9d-default-rtdb.firebaseio.com",
  authDomain: "exdate-92f9d.firebaseapp.com",

});

console.log("server started");

const job = schedule.scheduleJob('0 15 * * *', function () {
  console.log('The answer to life, the universe, and everything!');
  var db = admin.database();
  var topic = 'general';
  // var ref = firebase.database().ref().child('Products');

  const dbRef = db.ref("Products");
  const dbRef2_users = db.ref("Conected");
  let checkifexists;
  db.ref("Conected").once('value', (snapshot) => {
    if (snapshot.val() !== null) {
      var userconected = snapshot.val();
      console.log(userconected.exists);
      console.log();





      let date_ob = new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);

      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

      let year = date_ob.getFullYear();

      console.log(date + "" + month + " " + year);
      let currentdate = date + "/" + month + "/" + year;

      dbRef2_users.on('child_added', function (snapshot, prevChildKey) {
        var chile_user = snapshot.val();


        let newuser = new User(chile_user.username, chile_user.exists);

        if (chile_user.exists == "true") {
          dbRef.on('child_added', function (snapshot, prevChildKey) {
            const moment = require('moment');

            var child = snapshot.val();


            //  console.log( child.exdate);
            var goodDate = JSON.stringify(child.exdate);

            let messageToSend;
            var d1 = moment(child.exdate, 'DD/MM/YY');
            var datetime = new Date();
            let currentStringDate = datetime.toISOString().slice(0, 10);
            var d2 = moment(currentdate, 'DD/MM/YY');
            var diffDays = d1.diff(d2, 'days');
            ///  console.log(diffDays);
            let allAlarms = [];
            allAlarms = JSON.stringify(child.alarms).replace(/['"]+/g, '').split("/");
              console.log(allAlarms[0]);
            for (let j = 0; j < allAlarms.length; j++) {
              //  console.log(diffDays + " " + child.producName );
              if (allAlarms[j].toString() === diffDays.toString() && JSON.stringify(child.username).includes(chile_user.username)) {

                messageToSend = "שם מוצר: " + child.producName + " " + "ימים שנשארו: " + diffDays;
              }

            }

            if (messageToSend != null) {
              var message = {
                notification: {
                  title: "EXdate",
                  body: messageToSend
                },

                topic: topic

              };


              admin.messaging().send(message)
                .then((response) => {
                  // Response is a message ID string.
                  console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                  console.log('Error sending message:', error);
                });
            }

          });


        } else {
          console.log("user not good");
        }
      });

    } else {
      console.log("no data");

    }

  });
});













//let currentdate = date + "/" + month + "/" + year;

var arr = [];
var arr2 = [];
var arr3 = [];
var arr4 = [];
//   dbRef.on('child_added', (snapshot, prevChildKey) => {
//     const newPost = snapshot.val();
//     console.log('Name: ' + newPost.producName);
//     console.log('Barcode: ' + newPost.barcode);
//     console.log('Exdate: ' + newPost.exdate);
//     console.log('UserName: ' + newPost.username);
//     console.log('alarms: ' + newPost.alarms);
//     console.log('Previous Post ID: ' + prevChildKey);
//     arr = JSON.stringify(newPost.alarms).replace(/"/g,"").split("/") ;



//     arr2 = JSON.stringify(newPost.exdate).replace(/"/g,"");
//     let d1 = new Date(arr2[0]);
//    // arr3 = currentdate.split("/");
//     let d2 = new Date(JSON.stringify(currentdate));
//     let count = parseInt( arr[0]) - parseInt(arr2[0]) ;
//     console.log(d2.getDay()  + " "+ d1.getDate() + " " + arr2[0]);
//     for(let i = 0 ; i < arr.length-1; i++){

//    if((  parseInt( arr2[0]) ) == arr[i]){

//     var message  = {
//         notification: {
//           title: "this is not",
//          body: newPost.exdate
//         },


//         topic: topic

//       };
//       admin.messaging().send(message)
//       .then((response) => {
//         // Response is a message ID string.
//         console.log('Successfully sent message:', response);
//       })
//       .catch((error) => {
//         console.log('Error sending message:', error);
//     });
// }
//     }

//   });
// 

// // Send a message to devices subscribed to the provided topic.


// db.ref("Users").set(message2, function(error) {
//     if (error) {
//       // The write failed...
//       console.log("Failed with error: " + error)
//     } else {

//       // The write was successful...
//       console.log("success")
//     }
// });
