// routes/articleRoutes.js
const express = require('express');
const Tech_News = require('../models/Tech_News'); // Correct import path

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const technews = await Tech_News.find();
        res.status(200).json({
            success: true,
            data: technews
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const newArticle = new Tech_News(req.body);
        await newArticle.save();
        res.status(201).json({
            success: true,
            data: newArticle
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;
