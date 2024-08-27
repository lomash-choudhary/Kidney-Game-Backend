const express = require("express")
const app = new express()
const port = 3000
const uuid = require("uuid");
const fs = require("fs");
const { json } = require("body-parser");
app.use(express.json())

//get all the users
app.get("/get-all-users", (req,res) => {
  fs.readFile("kidney-practice.json", "utf-8", function (err, data) {
    if(err){
      res.sendStatus(500);
    }
    else{
      const jsonData = JSON.parse(data);
      res.send(jsonData);
    }
  })
})

//number of kidneys of particular user
app.get("/get-the-kidneys-of-user/:userid", (req,res) => {
  fs.readFile("kidney-practice.json","utf-8",function (err,data) {
    if(err){
      res.sendStatus(500);
    }
    else{
      const users = JSON.parse(data);
      let particularUser = users.filter(user => req.params.userid == user.username)
      let numberOfKidneys;
      let numberOfHealthyKidneys;
      let numberOfUnhealthyKidneys;
      numberOfHealthyKidneys = 0;
      numberOfKidneys = particularUser[0].kidney.length;
      for(let i = 0; i < particularUser[0].kidney.length; i++){
          if(particularUser[0].kidney[i].healthy === "true"){
            numberOfHealthyKidneys++;
          }
      }
    numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;
      res.json({
        numberOfKidneys,
        numberOfHealthyKidneys,
        numberOfUnhealthyKidneys
      })
    }
  })  
})

// A healthy kidney should be added in the particular user 
app.post("/add-healthy-kidney-to-user/:userId", (req,res) => {
  let update = false;
  fs.readFile("kidney-practice.json", "utf-8", function(err, data) {
    if(err){
      res.sendStatus(411);
    }
    else{
      const users = JSON.parse(data)
      const particularUser = users.find(user => req.params.userId === user.username)
      for(let i = 0; i < particularUser.kidney.length; i++){
        if(particularUser.kidney[i].healthy === "false"){
          update = true;
          particularUser.kidney.push({
            healthy: "true"
          })
        }
      }
      if(update === true){
        let jsonString = JSON.stringify(users, null, 2);
        fs.writeFile("kidney-practice.json", jsonString, function (err){
          if(!err){
            res.json({
              message: "healthy-kidney-added"
            })
          }
          else{
            res.sendStatus(500);
          }
        })
      }
      else{
        res.json({
          message: "No Unhealthy Kidney Found"
        })
      }
    }
  })
})


//update the unhealty kidney to healthy
app.put("/update-unhealty-to-healthy/:userId", (req,res) => {
  let update = false;
  fs.readFile("kidney-practice.json", "utf-8", function (err, data) {
    if(err){
      res.sendStatus(500)
    }
    else{
      const users = JSON.parse(data);
      const particularUser = users.find(user => req.params.userId === user.username)
      for(let i = 0; i < particularUser.kidney.length; i++){
        if(particularUser.kidney[i].healthy === "false"){
          update = true;
          particularUser.kidney[i].healthy = "true";
        }
      }
      if(update === true) {
        let jsonString = JSON.stringify(users, null, 2);
        fs.writeFile("kidney-practice.json", jsonString, function (err,data) {
          if(err){
            res.json(500);
          }
          else{
            res.json({
              message: "Kidney Updated"
            })
          }
        })
      }
      else{
        res.json({
          message: "No unhealthy kidney found"
        })
      }
    }
  })
})

//Delete the Unhealthy Kidney from the user
app.delete("/delete-unhealthy-kidney/:userId", (req,res) => {
  let update = false;
  fs.readFile("kidney-practice.json", "utf-8", function(err, data) {
    if(err){
      res.sendStatus(500)
    }
    else{
      const users = JSON.parse(data);
      const particularUser = users.find(user => req.params.userId === user.username)
      for(let i = 0; i < particularUser.kidney.length; i++){
        if(particularUser.kidney[i].healthy === "false"){
          update = true;
          particularUser.kidney.splice(i, 1);
        }
      }
      if(update === true) {
        const jsonString = JSON.stringify(users, null, 2)
        fs.writeFile("kidney-practice.json", jsonString, function(err, data){
          if(err){
            res.sendStatus(500)
          }
          else{
            res.json({
              message: "Unhealthy Kidney removed"
            })
          }
        })
      }
      else{
        res.json({
          message: "No unhealthy kidney found"
        })
      }
    }
  })
})

//Add new Users
app.post("/add-new-user/:enterUsername", (req,res) => {
  fs.readFile("kidney-practice.json", "utf-8", function (err,data) {
    if(err){
      res.sendStatus(500);
    }
    else{
      const users = JSON.parse(data)
      const body = req.body;
      users.push({
        username: req.params.enterUsername,
        ...body
      })
      const jsonString = JSON.stringify(users, null, 2);
      fs.writeFile("kidney-practice.json", jsonString, function (err, data){
        if(err){
          res.sendStatus(500);
        }
        else{
          res.json(users);
        }
      })
    }
  })
})

app.listen(port, () => {
  console.log("App is listening on PORT:",port);
})