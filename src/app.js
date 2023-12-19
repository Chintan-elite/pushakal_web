const express = require("express")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT
const DBURL = process.env.DBURL
const hbs = require("hbs")
const path = require("path")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
app.use(bodyParser())
app.use(cookieParser())
mongoose.connect(DBURL).then(data=>{
    console.log("DB Connected");
})

const viewPath = path.join(__dirname,"../templetes/views")
const partialPath = path.join(__dirname,"../templetes/partials")
const publicPath = path.join(__dirname,"../public")

app.set("view engine","hbs")
app.set("views",viewPath)
app.use(express.static(publicPath))
hbs.registerPartials(partialPath)
app.use("/",require("../router/userrouter"))

app.listen(PORT,()=>{
    console.log(`serer runningon port ${PORT}`);
})