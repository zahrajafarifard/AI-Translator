import User from "./user.model.js";
import Document from "./document.model.js";
import TranslationJob from "./translationJob.model.js";

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

// Document -> TranslationJob
Document.hasOne(TranslationJob, {
  foreignKey: "document_id",
  as: "translationJob",
  onDelete: "CASCADE",
});

// TranslationJob -> Document
TranslationJob.belongsTo(Document, {
  foreignKey: "document_id",
  as: "document",
});
