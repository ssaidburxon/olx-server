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

const Car = require("../model/carModel");
const Fashion = require("../model/fashionModel");
const Work = require("../model/workModel");

const carCtrl = {
  add: async (req, res) => {
    const { token } = req.headers;
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
          console.log(images);
          req.body.photos = images;
        } else {
          const format = image.mimetype.split("/")[1];
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
      const car = new Car(req.body);
      await car.save();
      res.status(201).json({ message: "new Car", car });
    } catch (error) {
      console.log(error);
      res.status(503).json({ message: error.message });
    }
  },
  get: async (req, res) => {
    try {
      const cars = await Car.find();
      console.log(cars);
      res.status(200).json({ message: "All Cars", getAll: cars });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },
  getOne: async (req, res) => {
    const { id } = req.params;
    try {
      const getCar = await Car.aggregate([
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
      if (!getCar) {
        return res.status(400).send({ message: "Car not found" });
      }
      res.status(200).json({ message: "Find Car", getOne: getCar });
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
      await Car.deleteMany({ gallaryId: id });
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
      const updateCar = await Car.findById(id);
      if (!updateCar) {
        return res.status(400).send({ message: "Car not found" });
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
          if (updateCar.picture) {
            await cloudinary.v2.uploader.destroy(
              updateCar.picture.public_id,
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
      const newCar = await Car.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).send({ message: "Update successfully", newCar });
    } catch (error) {
      res.status(503).json({ message: error.message });
    }
  },
  similar: async (req, res) => {
    try {
      const { name } = req.query;

      const result = await Promise.all([
        Car.find({ name: { $regex: new RegExp(name, "i") } }),
        Fashion.find({ name: { $regex: new RegExp(name, "i") } }),
        Work.find({ name: { $regex: new RegExp(name, "i") } }),
      ]);

      res.status(200).send({ message: "Found result", similar: result.flat() });
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = carCtrl;