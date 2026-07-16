import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Document extends Model {
  declare id: number;
  declare user_id: number;
  declare original_name: string;
  declare original_path: string;
  declare translated_path: string | null;
  declare status:
    | "UPLOADED"
    | "QUEUED"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";
  declare source_language: string;
  declare target_language: string;
  declare pages: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    original_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    original_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    translated_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "UPLOADED",
        "QUEUED",
        "PROCESSING",
        "COMPLETED",
        "FAILED"
      ),
      allowNull: false,
      defaultValue: "UPLOADED",
    },

    source_language: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    target_language: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Document",
    tableName: "documents",
    timestamps: true,
  }
);

export default Document;