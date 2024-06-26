const Sub = require("../model/subModel");
const cloudinary = require("cloudinary");

const subCtrl = {
    add: async (req, res) => {
        const { name } = req.body;
        const { token } = req.headers;
        try {
            if (!name) {
                return res.status(403).json({ message: "Please fill all lines" });
            }
            const sub = new Sub(req.body);
            await sub.save();
            res.status(201).json({ message: "new type", sub });
        } catch (error) {
            res.status(503).json({ message: error.message });
        }
    },
    get: async (req, res) => {
        try {
            const subs = await Sub.find();
            res.status(200).json({ message: "All sub categorys", getAll: subs });
        } catch (error) {
            res.status(503).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(403).json({ message: "insufficient information" });
        }

        try {
            const deleteGall = await Sub.findByIdAndDelete(id);
            if (!deleteGall) {
                return res.status(400).send({ message: "Gallary not found" });
            }
            const deletePic = await Sub.findById(id);

            if (deleteGall.length > 0) {
                deletePic.map(async (pic) => {
                    console.log(pic);
                    await cloudinary.v2.uploader.destroy(
                        pic.picture.public_id,
                        async (err) => {
                            if (err) {
                                throw err;
                            }
                        }
                    );
                });
            }
            await Type.deleteMany({ gallaryId: id });
            res.status(200).send({ message: "Gallary deleted", deleteGall });
        } catch (error) {
            res.status(503).json({ message: error.message });
        }
    },
};

module.exports = subCtrl;