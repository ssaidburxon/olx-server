const cloudinary = require("cloudinary")
const fs = require("fs")
const mongoose = require("mongoose")

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

const Work = require("../model/workModel")

const workCtrl = {
  add: async (req, res) => {
    const { token } = req.headers;
    try {
      if (!token) {
        return res.status(403).json({ message: "Token is required" });
      }
      const work = new Work(req.body);
      await work.save();
      res.status(201).json({ message: "new Work", work });
    } catch (error) {
      console.log(error);
      res.status(503).json({ message: error.message });
    }
  },
  get: async (req, res) => {
    try {
      const works = await Work.find();
      res.status(200).json({ message: "All Works", getAll: works });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },
  getOne: async (req, res) => {
    const { id } = req.params;
    try {
      const getWork = await Work.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
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
      if (!getWork) {
        return res.status(400).send({ message: "Work not found" });
      }
      res.status(200).json({ message: "Find Work", getOne: getWork });
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
      const deleteGall = await Work.findByIdAndDelete(id);
      if (!deleteGall) {
        return res.status(400).send({ message: "Gallary not found" });
      }
      const deletePic = await Car.findById(id);

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
      await Work.deleteMany({ gallaryId: id });
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
      const updateWork = await Work.findById(id);
      if (!updateWork) {
        return res.status(400).send({ message: "Work not found" });
      }
      const newWork = await Work.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).send({ message: "Update successfully", newWork });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },
};

module.exports = workCtrl;