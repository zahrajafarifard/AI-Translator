import { DataTypes, Model } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../config/database.js";

class Document extends Model<
  InferAttributes<Document, { omit: "createdAt" | "updatedAt" }>,
  InferCreationAttributes<Document, { omit: "createdAt" | "updatedAt" }>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare original_name: string;
  declare original_path: string;
  declare translated_path: string | null;
  declare status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  declare source_language: string;
  declare target_language: string;
  declare error_message: string | null;

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
      type: DataTypes.ENUM("QUEUED", "PROCESSING", "COMPLETED", "FAILED"),
      allowNull: false,
      defaultValue: "QUEUED",
    },

    source_language: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    target_language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    error_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Document",
    tableName: "documents",
    timestamps: true,
  },
);

export default Document;
