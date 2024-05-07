const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const dotenv = require("dotenv")
const socketIo = require("socket.io")
const http = require('http')
const cloudinary = require("cloudinary")
const mongoose = require("mongoose")

const path = require("path")
dotenv.config()

// routes
const authRouter = require("./src/router/authRouter")
const userRouter = require("./src/router/userRouter")
const categoryRouter = require("./src/router/categoryRouter")
const carRouter = require("./src/router/carRouter")
const subRouter = require("./src/router/subRouter")
const typeRouter = require("./src/router/typeRouter")
const fashionRouter = require("./src/router/fashionRouter")
const workRouter = require("./src/router/workRouter")
const chatRouter = require("./src/router/chatRouter")
const messageRouter = require("./src/router/messageRouter")

const app = express()
const PORT = process.env.PORT || 4001

const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "*",
        // origin: "http://localhost:3000", 
        // methods: ["GET", "POST"]
    }
})

// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//to save files for public
app.use(express.static(path.join(__dirname, 'src', 'public')))

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true }))
app.use(cors())

const MONGO_URL = process.env.MONGO_URL

app.get('/', (req, res) => {
    res.send('ok')
})

// routes use
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/sub', subRouter)
app.use('/api/type', typeRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/car', carRouter)
app.use('/api/', fashionRouter)
app.use('/api/', workRouter)

// websocket functions
let activeUsers = []

io.on("connection", (socket) => {
    socket.on("new-user-added", (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id })
        }

        io.emit("get-users", activeUsers)
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)

        io.emit("get-users", activeUsers)
    })

    socket.on("exit", (id) => {
        activeUsers = activeUsers.filter((user) => user.userId !== id)

        io.emit("get-users", activeUsers)
    })
})

mongoose.connect(MONGO_URL, {})
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))

    })
    .catch(error => console.log(error))