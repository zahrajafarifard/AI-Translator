import User from "./user.model.js";
import Document from "./document.model.js";

// User -> Documents
User.hasMany(Document, {
  foreignKey: "user_id",
  as: "documents",
  onDelete: "CASCADE",
});

// Document -> User
Document.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
