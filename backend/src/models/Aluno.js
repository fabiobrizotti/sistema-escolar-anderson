import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Aluno extends Model {}

Aluno.init(
  {
    nome: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    data_nascimento: { type: DataTypes.DATEONLY, allowNull: false },
    serie: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    turma_id: { type: DataTypes.INTEGER, allowNull: true },
    cpf: { type: DataTypes.STRING(14), unique: true, allowNull: true },
    telefone: { type: DataTypes.STRING, allowNull: true },
    endereco: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'aluno',
    tableName: 'alunos',
    timestamps: true,
    indexes: [{ fields: ['turma_id'] }],
  }
);

export default Aluno;
