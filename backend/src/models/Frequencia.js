import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Frequencia extends Model {}

Frequencia.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    aluno_id: { type: DataTypes.INTEGER, allowNull: false },
    data_aula: { type: DataTypes.DATEONLY, allowNull: false },
    presente: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    disciplina: { type: DataTypes.STRING, allowNull: true },
    turma_id: { type: DataTypes.INTEGER, allowNull: true },
    numero_aula: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    quantidade_aulas: { type: DataTypes.INTEGER, allowNull: true },
    plano_aula: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'frequencia',
    tableName: 'frequencias',
    timestamps: true,
    indexes: [
      { fields: ['aluno_id'] },
      { fields: ['data_aula'] },
      { fields: ['aluno_id', 'data_aula', 'disciplina', 'numero_aula'], unique: true },
    ],
  },
);

export default Frequencia;
