require('dotenv').config({ path: './.env.local' });
require("dotenv").config();
const jwtSecret = process.env.key || "bDf4X9zP7qA2eR5tG8mV3wJ6sK1yN0cL"; // Fallback

console.log("JWT Secret Key:", jwtSecret);

console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging

const express = require("express");

// dotenv to securely store values 
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;


const cors = require("cors")
const app = express();
app.use(express.json());
const { v4: uuidV4 } = require("uuid")

app.use(cors())

const { sendEmail } = require("./nodemailer/sendingEmail")

// importing necessary things from other files
// const { connection } = require("./config/db");
const connectDB = require("./config/db");
const { patientRoute } = require("./route/patientRoute");
const { doctorRoute } = require("./route/doctorRoute");
const { appointmentRoute } = require("./route/appointmentRoute");
const { adminRoute } = require("./route/adminRoute");


// home route
app.get("/", async (req, res) => {
    res.status(200).send("Welcome to Hospital Management Backend");
})

app.post("/email", async (req, res) => {
    const { email, url } = req.body
    try {
        sendEmail({
            email: email, subject: "Video Call link", body: url
        });

        res.send({ "message": "EMAIL sent" })
    }
    catch (err) {
        res.send({ "message": "error" })
    }

})

// redirect routes
app.use("/patients", patientRoute)
app.use("/doctors", doctorRoute)
app.use("/appointments", appointmentRoute)

app.use("/admin", adminRoute)

app.get('/video', (req, res) => {
    res.redirect(`/video/${uuidV4()}`)
})

app.get('/video/:room', (req, res) => {
    res.send({ roomId: req.params.room })
})

const server = require('http').Server(app)
const io = require('socket.io')(server)


io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.emit('user-disconnected', userId)
        })
    })
})


server.listen(process.env.PORT || 8080, async () => {
    try {
        await connectDB();  // Connect to Database
        console.log("✅ DB is connected");
    } catch (error) {
        console.error("❌ DB is not connected", error);
    }
    console.log(`🚀 Listening at Port ${process.env.PORT || 8080}`);
});