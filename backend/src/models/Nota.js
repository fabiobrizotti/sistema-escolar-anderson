import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Nota extends Model {}

Nota.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    disciplina: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    bimestre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 4, notEmpty: true },
    },
    nota: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      validate: { min: 0, max: 10, notEmpty: true },
    },
    aluno_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'nota',
    tableName: 'notas',
    timestamps: true,
    indexes: [
      { fields: ['aluno_id'] },
      { fields: ['disciplina'] },
      { fields: ['aluno_id', 'disciplina', 'bimestre'], unique: true },
    ],
  },
);

export default Nota;
