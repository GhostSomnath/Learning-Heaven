// models/Tech_News.js
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true }
});

const Tech_News = mongoose.model('Tech_News', ArticleSchema);
module.exports = Tech_News;
