const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  if (update.name) update.slug = slugify(update.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Category", categorySchema);
