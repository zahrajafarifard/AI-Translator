import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class TranslationJob extends Model {
  declare id: number;
  declare document_id: number;
  declare bull_job_id: string;
  declare progress: number;
  declare started_at: Date | null;
  declare completed_at: Date | null;
  declare error: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TranslationJob.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bull_job_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },

    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TranslationJob",
    tableName: "translation_jobs",
    timestamps: true,
  }
);

export default TranslationJob;