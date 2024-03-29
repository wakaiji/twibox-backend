require("dotenv").config()

const express = require('express')
const FileUpload = require('express-fileupload')
const cors = require('cors')
const http = require('http')
const helmet = require('helmet')
const compression = require('compression')

const app = express()
const { allowedDomains, clientServer } = require("./config/index")

const corsOptions = {
  origin: "*",
  domains: allowedDomains,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const campaignRouter = require("./routes/twibbon/campaign")
const userRouter = require("./routes/user")
const authRouter = require("./routes/auth")

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', clientServer);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(FileUpload())
app.use(express.static("public"))
app.use(cors(corsOptions))
app.use(helmet())
app.use(compression())
// app.use(authenticateToken)
// app.use(regenerateAccessToken)


app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/campaigns", campaignRouter)

const server = http.createServer(app)

server.listen(process.env.PORT, function() {
  console.log(`Node app is running on port ${process.env.PORT}`)
})

module.exports = app