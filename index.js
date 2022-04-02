const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jswt = require("jsonwebtoken");
const secret = "AkYeHoPkd";
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://praveen:prmdb@cluster0.gg5fe.mongodb.net/retryWrites=true&w=majority";


app.use(express.json())
app.use(cors({
    origin: "*"
}))

let authenticate = function (req, res, next) {
    try{
    if (req.headers.authorization) {
        let result = jswt.verify(req.headers.authorization, secret);
        console
        if (result) {
            next();
        }
        else {
            res.json({ message: "token invalid" })
        }
    }
    else {
        res.json({ message: "not authorized" })
    }
}catch{
     console.log("token expired");
        res.json({ message: "token expired" })
}
}



app.post('/register', async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let user = await db.collection("registeration").findOne({ email: req.body.email });
        if (user) {
            res.json({ message: "Email already exist!" });
            connection.close();
        }
        else {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            req.body.password = hash;
            await db.collection("registeration").insertOne(req.body)
            res.json({ message: "registered" });
            connection.close();
        }
    } catch (error) {
        console.log(error)
        res.json(["error"])
    }
})

app.get("/login", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let attendancedata = await db.collection("registeration").find({}).project({ "_id": 0 }).toArray();
        await connection.close();
        res.json(attendancedata);
    } catch (error) {
        console.log(error)
    }

});

app.post('/login', async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let user = await db.collection("registeration").findOne({ email: req.body.email });
        
        if (user){
            let passwordcheck = await bcrypt.compare(req.body.password, user.password)
           
            if (passwordcheck) {
                let token = jswt.sign({ userid: user._id }, secret, { expiresIn: '10h' });
                res.json({ message: "login", user, token });
            } else {
                res.json({ message: "email id or password incorrect" });
            }
           
        } else {
            res.json({ message: "User not registered" });
        }
       
        connection.close();

    } catch (error) {
        res.json(["email id or password incorrect"])
    }
})

app.post("/addcar", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental")
        await db.collection("cars").insertOne(req.body)
         await connection.close();
        res.json({ message: "item Added to cart" })
    } catch (error) {
        console.log(error)
    }
});

app.get("/view/:id",async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
         let menu = await db.collection("cars").find({cartype:req.params.id}).toArray();
         await connection.close();
        res.json(menu);
    } catch (error) {
        console.log(error)
    }
});

app.post("/order", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental")
        await db.collection("order").insertOne(req.body)
         await connection.close();
        res.json({ message: "item Added to cart" })
    } catch (error) {
        console.log(error)
    }
});

app.get("/car/:id",authenticate, async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let objId = mongodb.ObjectId(req.params.id)
         let item = await db.collection("cars").find({_id:objId}).toArray();
         await connection.close();
        res.json(item);
    } catch (error) {
        console.log(error)
    }
});

app.get("/mybooking/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
         
        let menu = await db.collection("order").find({userid:req.params.id,payment:'not paid'}).toArray();
        await connection.close();
        res.json(menu);
    } catch (error) {
        console.log(error)
    }
});

app.get("/confirmedbooking/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
         
        let menu = await db.collection("order").find({userid:req.params.id,payment:'paid'}).toArray();
        await connection.close();
        res.json(menu);
    } catch (error) {
        console.log(error)
    }
});

app.delete("/delete/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let objId = mongodb.ObjectId(req.params.id)
        var deldata = await db.collection("order").deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: "User Deleted" })
    } catch (error) {
        console.log(error)
    }
});

app.get("/editorder/:id",authenticate, async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let objId = mongodb.ObjectId(req.params.id)
         let item = await db.collection("order").find({_id:objId}).toArray();
         await connection.close();
        res.json(item);
    } catch (error) {
        console.log(error)
    }
});

app.get("/payorder/:id",authenticate, async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let objId = mongodb.ObjectId(req.params.id)
         let item = await db.collection("order").find({_id:objId}).toArray();
         await connection.close();
        res.json(item);
    } catch (error) {
        console.log(error)
    }
});

app.get("/calorder/:id",authenticate, async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let objId = mongodb.ObjectId(req.params.id)
         let item = await db.collection("order").find({_id:objId}).toArray();
         await connection.close();
        res.json(item);
    } catch (error) {
        console.log(error)
    }
});



app.put("/order/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let objId = mongodb.ObjectId(req.params.id)
        console.log(req.body)
        var updatedarr = await db.collection("order").updateOne({ _id: objId }, { $set: req.body })
        console.log(updatedarr);
        await connection.close();
        res.json({ message: "User Updated" })
    } catch (error) {
        res.json(error);
        console.log(error)
    }
});

app.put("/payorder/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("carrental");
        let objId = mongodb.ObjectId(req.params.id)
        console.log(req.body)
        var updatedarr = await db.collection("order").updateOne({ _id: objId }, { $set: {payment:'paid'} })
        console.log(updatedarr);
        await connection.close();
        res.json({ message: "User Updated" })
    } catch (error) {
        res.json(error);
        console.log(error)
    }
});

app.listen(3003, () => { console.log("app is running") })
