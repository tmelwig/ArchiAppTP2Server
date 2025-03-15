var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})

// TP2 2.1
app.get('/test/*', function(req, res) {
  const pathValue = req.url.substr(6); // Remove the "/test/" prefix (6 characters)

  // Return a JSON object with the extracted value
  res.json({
      msg: pathValue
  });
});

// TP2 2.3
let compteur = 0;
// Route /cpt/query to get compteur value
app.get('/cpt/query', function(req, res) {
  res.json({
    compteur: compteur
  });
});

// Route /cpt/inc?v=XXX to increment compteur by v
app.get('/cpt/inc', function(req, res) {
  const value = req.query.v;
  console.log(value)
  if (value !== undefined) {
    // Check if v is an int
    const parsedValue = parseInt(value, 10);  // Convert v into an int
    if (!isNaN(parsedValue)) { // If int
      compteur += parsedValue;
      res.json({
        code: 0
      });
    } else {
      res.json({
        code: -1
      });
    }
  } else {
    // If v is missing, default: increment by 1
    compteur += 1;
    res.json({
      code: 0
    });
  }
});

// TP2 2.4
var allMsgs = [
  { msg: "Hello World", pseudo: "Tom", date: "2025-03-14T12:00:00" },
  { msg: "foobar", pseudo: "Tommy", date: "2025-03-14T12:05:00" },
  { msg: "CentraleSupelec Forever", pseudo: "Tomato", date: "2025-03-14T12:10:00" }
];

// Route /msg/get/* to return the message based on the index
app.get('/msg/get/:index', function(req, res) {
  const index = parseInt(req.params.index, 10);
  
  if (!isNaN(index) && index >= 0 && index < allMsgs.length) {
    // If the index is a valid integer and within the range of the messages array
    res.json({
      code: 1,
      msg: allMsgs[index]
    });
  } else {
    res.json({
      code: 0
    });
  }
});

// Route /msg/nber to return the total number of messages
app.get('/msg/nber', function(req, res) {
  res.json({
    nber: allMsgs.length
  });
});

// Route /msg/getAll to return all messages as an array
app.get('/msg/getAll', function(req, res) {
  res.json({
    msgs: allMsgs
  });
});

// Route /msg/post/[message] to add a new message
// Before pseudo and date
// app.get('/msg/post/*', function(req, res) {
//   const newMsg = unescape(req.params[0]);

//   allMsgs.push(newMsg);

//   const newIndex = allMsgs.length - 1;
//   res.json({
//     msgIndex: newIndex
//   });
// });

// After pseudo and date TP2 - 3.2
app.get('/msg/post/*', function(req, res) {
  const newMsg = unescape(req.params[0]);
  const pseudo = req.query.pseudo || "Anonymous";  // By default "Anonymous"
  const date = new Date().toISOString().slice(0, 19); // Only keep YYYY-MM-DDTHH:MM:SS

  const message = { msg: newMsg, pseudo: pseudo, date: date };
  allMsgs.push(message);

  const newIndex = allMsgs.length - 1;
  res.json({
    msgIndex: newIndex
  });
});


app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

