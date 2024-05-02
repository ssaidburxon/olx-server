const cloudinary = require("cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const removeTemp = (pathes) => {
    fs.unlink(pathes, (err) => {
        if (err) {
            throw err;
        }
    });
};

const Fashion = require("../model/fashionModel");

const fashionCtrl = {
    add: async (req, res) => {
        const { token } = req.headers;
        console.log(req.body);
        try {
            if (!token) {
                return res.status(403).json({ message: "Token is required" });
            }
            if (req.files) {
                let images = [];
                const { image } = req.files;
                if (image?.length > 0) {
                    for (const img of image) {
                        const format = img.mimetype.split("/")[1];
                        if (format !== "png" && format !== "jpeg") {
                            return res.status(403).json({ message: "File format incorrect" });
                        }
                        const createdImage = await cloudinary.v2.uploader.upload(
                            img.tempFilePath,
                            {
                                folder: "Olx",
                            }
                        );

                        removeTemp(img.tempFilePath);

                        const imag = {
                            public_id: createdImage.public_id,
                            url: createdImage.secure_url,
                        };
                        images.push(imag);
                    }
                    req.body.photos = images;
                } else {
                    const format = image.mimetype.split("/")[1];
                    console.log('ok');
                    if (format !== "png" && format !== "jpeg") {
                        return res.status(403).json({ message: "File format incorrect" });
                    }
                    const createdImage = await cloudinary.v2.uploader.upload(
                        image.tempFilePath,
                        {
                            folder: "Olx",
                        }
                    );
                    removeTemp(image.tempFilePath);
                    const imag = {
                        public_id: createdImage.public_id,
                        url: createdImage.secure_url,
                    };
                    images.push(imag);
                    req.body.photos = images;
                }
            }
            const fashion = new Fashion(req.body);
            await fashion.save();
            res.status(201).json({ message: "new fashion", fashion });
        } catch (error) {
            console.log(error);
            res.status(503).json({ message: error.message });
        }
    },
    get: async (req, res) => {
        try {
            const fashions = await Fashion.find();
            res.status(200).json({ message: "All fashions", getAll: fashions });
        } catch (error) {
            res.status(503).json({ message: error.message });
        }
    },
    getOne: async (req, res) => {
        const { id } = req.params;
        try {
            const getFashion = await Fashion.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) },
                },
                {
                    $lookup: {
                        from: "cars",
                        let: { authorId: "$authorId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$authorId", "$$authorId"] } } },
                        ],
                        as: "userCar",
                    },
                },
                {
                    $lookup: {
                        from: "fashions",
                        let: { authorId: "$authorId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$authorId", "$$authorId"] } } },
                        ],
                        as: "userFashion",
                    },
                },
                {
                    $lookup: {
                        from: "works",
                        let: { authorId: "$authorId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$authorId", "$$authorId"] } } },
                        ],
                        as: "userWork",
                    },
                },
                {
                    $addFields: {
                        userProd: {
                            $concatArrays: ["$userCar", "$userFashion", "$userWork"],
                        },
                    },
                },
                {
                    $project: {
                        userCar: 0,
                        userFashion: 0,
                        userWork: 0,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { user: "$authorId" },
                        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$user"] } } }],
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
            ]);

            if (!getFashion) {
                return res.status(400).send({ message: "Fashion not found" });
            }
            res.status(200).json({ message: "Find Fashion", getOne: getFashion });
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
            const deleteGall = await Car.findByIdAndDelete(id);
            if (!deleteGall) {
                return res.status(400).send({ message: "Gallary not found" });
            }
            const deletePic = await Fashion.findById(id);

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
            await Fashion.deleteMany({ gallaryId: id });
            res.status(200).send({ message: "Gallary deleted", deleteGall });
        } catch (error) {
            res.status(503).json({ message: error.message });
        }
    },
    update: async (req, res) => {
        const { title } = req.body;
        const { id } = req.params;
        if (!title || !id) {
            return res.status(403).json({ message: "insufficient information" });
        }
        try {
            const updateFashion = await Fashion.findById(id);
            if (!updateFashion) {
                return res.status(400).send({ message: "Fashion not found" });
            }
            if (req.files) {
                const { image } = req.files;
                if (image) {
                    const format = image.mimetype.split("/")[1];
                    if (format !== "png" && format !== "jpeg") {
                        return res.status(403).json({ message: "file format incorrect" });
                    }
                    const imagee = await cloudinary.v2.uploader.upload(
                        image.tempFilePath,
                        {
                            folder: "OLX",
                        },
                        async (err, result) => {
                            if (err) {
                                throw err;
                            } else {
                                removeTemp(image.tempFilePath);
                                return result;
                            }
                        }
                    );
                    if (updateFashion.picture) {
                        await cloudinary.v2.uploader.destroy(
                            updateFashion.picture.public_id,
                            async (err) => {
                                if (err) {
                                    throw err;
                                }
                            }
                        );
                    }
                    const imag = { public_id: imagee.public_id, url: imagee.secure_url };
                    req.body.sub_photos = imag;
                }
            }
            const newFashion = await Fashion.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).send({ message: "Update successfully", newFashion });
        } catch (error) {
            res.status(503).json({ message: error.message });
        }
    },
};

module.exports = fashionCtrl;