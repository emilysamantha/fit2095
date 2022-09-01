const PORT_NUMBER = 8080;

// Importing packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Configure express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Static assets
app.use(express.static("images"));
app.use(express.static("css"));

// Bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

// Referencing schemas
const Parcel = require("./models/parcel");

// Mongoose URL
let mongooseUrl = "mongodb://34.127.125.44:27017/fit2095DB";

// Connect to Mongoose
mongoose.connect(mongooseUrl, function (err) {
  if (err) {
    console.log("Error in Mongoose connection");
    throw err;
  }

  console.log("Successfully connected");
});

// Route handlers
// Homepage
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/homepage.html"));
});

// New parcel
app.get("/newparcel", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/newparcel.html"));
});

// List parcels page
app.get("/listparceloption", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/listparceloption.html"));
});

// List all parcels
app.get("/listparcelsall", function (req, res) {
  Parcel.find({}, function (err, docs) {
    res.render("listparcels.html", { parcels: docs, title: "All Parcels" });
  });
});

// List parcels by sender
app.get("/listparcelssender", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/listparcelssender.html"));
});

// List parcels by weight
app.get("/listparcelsweight", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/listparcelsweight.html"));
});

// POST request: receive parcel details and insert new document to the collection
app.post("/newparceldata", function (req, res) {
  let sender = req.body.sender;
  let address = req.body.address;
  let weight = req.body.weight;
  let fragile = req.body.fragile ? true : false;
  let shipment = req.body.shipment;

  if (sender.length < 3 || address.length < 3 || weight < 0) {
    res.sendFile(path.join(__dirname, "/views/invaliddata.html"));
  } else {
    let newParcel = new Parcel({
      sender: sender,
      address: address,
      weight: weight,
      fragile: fragile,
      shipment: shipment,
    });
    newParcel.save(function (err) {
      if (err) throw err;
      console.log("Parcel successfully Added to DB");
    });
    res.redirect("/listparcelsall");
  }
});

// List parcels by Sender
app.post("/listparcelssender", function (req, res) {
  let sender = req.body.sender;
  Parcel.find({ sender: sender }, function (err, docs) {
    res.render("listparcels.html", {
      parcels: docs,
      title: "Parcels by Sender (" + req.body.sender + ")",
    });
  });
});

// List parcels by Weight
app.post("/listparcelsweight", function (req, res) {
  let weightStart = req.body.weightStart;
  let weightEnd = req.body.weightEnd;
  Parcel.where("weight")
    .gte(weightStart)
    .lte(weightEnd)
    .exec(function (err, docs) {
      res.render("listparcels.html", {
        parcels: docs,
        title:
          "Parcels by Weight (From " +
          weightStart +
          " up to " +
          weightEnd +
          " kg)",
      });
    });
});

// Delete all parcels by a sender or by an ID
app.get("/deleteparcel", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/deleteparcel.html"));
});

app.post("/deleteparcel", function (req, res) {
  let idToDelete = req.body.id;
  Parcel.deleteOne({ _id: idToDelete }, function (err, doc) {
    res.redirect("/listparcelsall");
  });
});

// Update a parcel by _id: the page takes an id and all other fields as input
app.get("/updateparcel", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/updateparcel.html"));
});

app.post("/updateparcel", function (req, res) {
  let idToUpdate = req.body.id;
  let sender = req.body.sender;
  let address = req.body.address;
  let weight = req.body.weight;
  let fragile = req.body.fragile;
  let shipment = req.body.shipment;

  console.log(idToUpdate);

  Parcel.updateOne(
    { _id: idToUpdate },
    {
      $set: {
        sender: sender,
        address: address,
        weight: weight,
        fragile: fragile,
        shipment: shipment,
      },
    },
    function (err, doc) {
      console.log(doc);
    }
  );
  res.redirect("/listparcelsall");
});

// Error
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/error.html"));
});

// Listening to port
app.listen(PORT_NUMBER, () => {
  console.log("Listening on http://localhost: " + PORT_NUMBER);
});
