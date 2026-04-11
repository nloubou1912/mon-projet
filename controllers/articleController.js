const Article = require('../models/articleModel');

exports.getAllArticles = async (req, res) => {
    try {
        const filters = { categorie: req.query.categorie };
        const articles = await Article.findAll(filters);
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const id = await Article.create(req.body);
        res.status(201).json({ message: "Article créé", id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article non trouvé" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        await Article.update(req.params.id, req.body);
        res.json({ message: "Article mis à jour avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        await Article.delete(req.params.id);
        res.json({ message: "Article supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
