import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Turma extends Model {}

Turma.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true } },
    serie: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true } },
    ano: { type: DataTypes.STRING(4), allowNull: false, validate: { is: /^\d{4}$/ } },
  },
  {
    sequelize,
    modelName: 'turma',
    tableName: 'turmas',
    timestamps: true,
    indexes: [{ unique: true, fields: ['nome', 'serie', 'ano'] }],
  }
);

export default Turma;
