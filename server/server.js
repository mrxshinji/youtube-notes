const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const cors = require("cors");
const { reset } = require("nodemon");

// -------- Express -----------------
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())
// -------- Express -----------------

// --------------------- MONGO --------------------------
mongoose.connect("mongodb://localhost:27017/noteSessionDB")
// Schema
const noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    time: Number
});

const sessionSchema = new mongoose.Schema({
    session: String,
    link: String,
    notes: [noteSchema]
});

const Note = new mongoose.model("note", noteSchema)
const Session = new mongoose.model("session", sessionSchema)


// manual insert test
// const note1 = new Note({
//     title: "string title",
//     body: "body post",
//     time: 1
// })
// const session1 = new Session({
//     session: "Session 2",
//     link: "https://www.youtube.com/watch?v=B-ytMSuwbf8",
//     notes: note1
// })
// session1.save()

// --------------------- MONGO --------------------------

// send data
app.get("/api", async (req, res) => {
    const items = await Session.find().sort({_id: -1}).exec()
    res.send(items)
})


// add session
app.post("/add", async (req, res) => {
    const newSession = new Session({
        session: req.body.sessionName,
        link: req.body.link,
        notes: []
    })
    await newSession.save(async (err) => {
        if (err) {
            console.log(err)
            res.status(400)
        } else {
            console.log(`Sucessfully added ${newSession}`)
            const items = await Session.find().sort({_id: -1}).exec()
            const newItem = items[0]
            console.log(newItem)
            res.send(newItem)
        }
    })
})


// add note
app.post("/add/note", async (req, res) => {
    const receive = req.body
    const newNote = new Note({
        title: receive.title,
        body: receive.body,
        time: receive.time
    })
    Session.findOne({_id: receive.sessionId}, async (err, data) => {
        if (err) {
            console.log(err);
            res.status(400, err)
        } else {
            data.notes.push(newNote);
            await data.save( async (err, resData) => { 
                if (err) {
                    console.log(err);
                    res.send(400)
                } else {
                    console.log(`Sucessfully added ${newNote}`)
                    res.send(resData.notes[data.notes.length - 1])
                }
            });
        }
    })
})


// delete session
app.post("/delete", async (req, res) => {
    const reqId = req.body;
    await Session.deleteOne({_id: reqId.id}, (err) => {
        if (err) {
          console.log(err)
          res.status(400)
        } else {
          console.log("Successful delete")
          res.send("completed")
        }
      }).clone()
})


// delete note
app.post("/delete/note", async (req, res) => {
    const {sessionId, noteId} = req.body;
    await Session.updateOne({_id: sessionId}, {
        $pull: {
            notes: {_id: noteId}
        }
    }, (err) => {
        if (err) {
            console.log(err)
            res.status(400)
        } else {
            console.log("Succesfulyl delete")
            res.send("completed")
        }
    }).clone()
})


// update note
app.post("/update/note", async (req, res) => {
    const {title, body, time, _id, sessionId} = req.body
    console.log(req.body)
    await Session.updateOne({_id: sessionId}, {
        $set: {
            notes: {
                _id: _id,
                title: title,
                body: body,
                time: time
            }
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400, err);
        } else {
            console.log("Sucessfully updated");
            console.log(data);
            res.send(data);
        };
    }).clone()
});


// port listen
app.listen(3001, function() {
    console.log("Server started on port 3001");
  })

