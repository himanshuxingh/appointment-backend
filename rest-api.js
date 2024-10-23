var express = require("express");
require("dotenv").config();
var app = express();
var mongoClient = require("mongodb").MongoClient;
var conStr = process.env.MONGO_URI;


var cors=require("cors");// allow all request methods 
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("<h1>this is home</h1>");
    res.end();
});

// get-user
app.get("/get-users", (req, res) => {
    mongoClient.connect(conStr)
        .then(clientObj => {
            var database = clientObj.db("calenderdb");
            database.collection("users")
                .find({})
                .toArray()
                .then(documents => {
                    res.send(documents);
                    res.end();
                });
        });
});
// appointment-based on userid 
app.get("/get-appointments/:userid",(req,res)=>{
    mongoClient.connect(conStr)
    .then(clientObj=>{
        var database=clientObj.db("calenderdb");
        database.collection("appointments")
        .find({UserId:req.params.userid})
        .toArray()
        .then(documents=>{
            res.send(documents);
            res.end();
        });
    });     
});

// resiter user 
app.post("/register-user",(req,res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database=clientObj.db("calenderdb");
        var user={
            UserId:req.body.UserId,
            UserName:req.body.UserName,
            Password:req.body.Password,
            Email:req.body.Email,
            Mobile:req.body.Mobile
        };
        database.collection("users")
        .insertOne(user)
        .then(()=>{
           console.log("user registerd");
           res.end();
        });
    });
});
// add task 
app.post("/add-task",(req,res)=>{
    mongoClient.connect(conStr)
    .then(clientObj=>{
        var database=clientObj.db("calenderdb");
        var appointment={
            Appointment_Id:parseInt(req.body.Appointment_Id),
            Title:req.body.Title,
            Description:req.body.Description,
            Date:new Date(req.body.Date),
            UserId:req.body.UserId
        };
        database.collection("appointments")
        .insertOne(appointment)
        .then(()=>{
            console.log("task added succesfully");
            res.end();
        });
    });
});
// edit-task
app.put("/edit-task/:id",(req,res)=>{
    // check --
    console.log(req.body);
    mongoClient.connect(conStr)
    .then(clientObj=>{
        var database=clientObj.db("calenderdb");
        var appointment={
            Appointment_Id:parseInt(req.params.id),
            Title:req.body.Title,
            Description:req.body.Description,
            Date:new Date(req.body.Date),
            UserId:req.body.UserId
        };
        database.collection("appointments")
        .updateOne({Appointment_Id:parseInt(req.params.id)},{$set:appointment})
        .then(()=>{
            console.log("updated succesfully");
            res.end();
        });
    });
});
// remove-task
app.delete("/remove-task/:id",(req,res)=>{
    mongoClient.connect(conStr)
    .then(clientObj=>{
        var database=clientObj.db("calenderdb");
        
        database.collection("appointments")
        .deleteOne({Appointment_Id:parseInt(req.params.id)})
        .then(()=>{
            console.log("task deleted");
            res.end();
        });
    });
})

// get appoint based on the Appointment_Id

app.get("/appointments/:id",(req,res)=>{
   mongoClient.connect(conStr)
   .then(clientObj=>{
    var database=clientObj.db("calenderdb");
    database.collection("appointments").find({Appointment_Id:parseInt(req.params.id)})
    .toArray().then(documents=>{
        res.send(documents);
        res.end();
    });
   });
});

app.listen(3300);
console.log("server running at: http://127.0.0.1:3300");
