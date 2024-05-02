const Category = require("../model/categoryModel")
const Car = require("../model/carModel")
const { v4 } = require('uuid')

const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, "../", "public")

const categoryCtrl = {
    add: async (req, res) => {
        try {
            if (req.files) {
                const { image } = req.files;
                console.log(image);
                const format = image.mimetype.split('/')[1];
                if (format !== 'png' && format !== 'jpeg') {
                    return res.status(403).json({ message: 'fill eformat incorrect' })
                }
                if (image.size > 1000000) {
                    return res.status(403).json({ message: 'Image size must be less than (1) MB' })
                }
                const nameImg = `${v4()}.${format}`
                image.mv(path.join(uploadsDir, nameImg), (err) => {
                    if (err) {
                        return res.status(503).json({ message: err.message })
                    }
                })
                req.body.categoryImg = nameImg;
            }
            const newCategory = new Category(req.body)
            await newCategory.save()
            res.status(201).json({ message: 'new Category', newCategory })
        } catch (error) {
            res.status(503).json({ message: error.message })
        }

    },
    get: async (req, res) => {
        try {
            const categorys = await Category.find();
            res.status(200).json({ message: 'Categorys', categorys })
        } catch (error) {
            res.status(503).json({ message: error.message })
        }
    },
    getOne: async (req, res) => {
        const { id } = req.params;
        try {
            const category = await Category.findById(id);
            if (category) {
                return res.status(200).json({ message: "found category", category })
            }
        } catch (error) {
            res.status(503).json({ message: error.message })
        }
    },
    deleteCategory: async (req, res) => {
        const { categoryId } = req.params
        try {
            const findCategory = await Category.findById(categoryId);
            if (findCategory) {
                (await Car.find({ categoryId: findCategory._id })).forEach(car => {
                    if (car.carImg) {
                        fs.unlinkSync(path.join(uploadsDir, car.carImg), (err) => {
                            if (err) {
                                return res.status(503).json({ message: err.message })
                            }
                        })
                    }
                })
                await Car.deleteMany({ categoryId: findCategory._id })
                await Category.deleteOne(findCategory._id)
                return res.status(200).json({ message: 'Category deleted successfully' })
            }
            res.status(404).json({ message: 'Category not foud' })
        } catch (error) {
            res.status(503).json({ message: error.message })
        }
    },
}

module.exports = categoryCtrl;