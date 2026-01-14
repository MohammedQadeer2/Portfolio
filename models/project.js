const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tagline: String,
  category: String,
  description: String,
  githubRepoUrl: String,
  liveDemoUrl: String,
  thumbnail: String,
  visibility: String,

}, { timestamps: true });

const SkillSchema = new mongoose.Schema({
  newSkill: String,
}, { timestamps: true });

module.exports = {
  Project: mongoose.model("Project", projectSchema),
  Skill: mongoose.model("Skill", SkillSchema)
};

 