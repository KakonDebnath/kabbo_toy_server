const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// usr Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Kabbo toys is running")
})


app.listen(port, ()=>{
    console.log(`Kabbo toys is listening on ${port}`);
})
