const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const path = require("path");
const punycode = require("punycode/");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        await db.collection("users").doc(email).set({ email, password });
        res.json({ message: "User signed up successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDoc = await db.collection("users").doc(email).get();
        if (!userDoc.exists || userDoc.data().password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
