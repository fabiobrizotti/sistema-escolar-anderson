import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Usuario extends Model {}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    senha_hash: { type: DataTypes.STRING, allowNull: false },
    perfil: {
      type: DataTypes.ENUM('admin', 'professor', 'aluno'),
      allowNull: false,
      defaultValue: 'professor',
    },
    disciplina: { type: DataTypes.STRING, allowNull: true },
    aluno_id: { type: DataTypes.INTEGER, allowNull: true, unique: true },
  },
  {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuarios',
    timestamps: true,
    indexes: [{ fields: ['perfil'] }],
  },
);

export default Usuario;
