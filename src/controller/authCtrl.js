const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Users = require("../model/authModel")

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authCtrl = {
    signUp: async (req, res) => {
        const { email } = req.body
        try {
            const existingUser = await Users.findOne({ email })
            if (existingUser) {
                return res.status(400).json({ message: "This is email already exists!" })
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            req.body.password = hashedPassword

            const user = new Users(req.body)
            await user.save()

            const { password, ...otherDetails } = user._doc

            const token = JWT.sign(otherDetails, JWT_SECRET_KEY, { expiresIn: "1h" })

            res.status(201).json({ message: "signup succsess", user: otherDetails, token })

        } catch (error) {
            console.log(error)
            res.status(503).json({ message: error.message })
        }
    },
    signIn: async (req, res) => {
        const { email } = req.body
        try {
            if (!req.body.password || !email) {
                return res.status(403).send({ massage: "pleace fill all fields" })
            }
            let findUser = await Users.findOne({ email })
            if (!findUser) {
                return res.status(404).send({ massage: "login or password is incorrect" })
            }
            let verifyPassword = await bcrypt.compare(req.body.password, findUser.password)
            if (!verifyPassword) {
                return res.status(404).send({ massage: "login or password is incorrect" })
            }
            const { password, ...otherElements } = findUser._doc

            const token = JWT.sign(otherElements, JWT_SECRET_KEY)

            res.status(200).send({ massage: "Login successfully", token, user: otherElements })

        } catch (error) {
            res.status(503).send({ massage: error.massage })
        }
    },
    googleAuth: async (req, res) => {
        const { email } = req.body;
        try {
            const findUser = await Users.findOne({ email });
            if (findUser) {
                const token = JWT.sign(
                    { email: findUser.email, _id: findUser._id, role: findUser.role },
                    JWT_SECRET_KEY
                );

                res
                    .status(200)
                    .send({ message: "Login successfully", findUser, token });
            } else {
                const newUser = await Users.create(req.body);

                const token = JWT.sign(newUser, JWT_SECRET_KEY, {
                    expiresIn: "24h",
                });

                res.status(201).send({
                    message: "Created successfully",
                    user: newUser,
                    token,
                });
            }
        } catch (error) {
            res.status(503).json({ message: error.message });
        }
    },
    
}

module.exports = authCtrl