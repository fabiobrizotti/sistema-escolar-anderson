import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Auditoria extends Model {}

Auditoria.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    usuario_nome: { type: DataTypes.STRING, allowNull: true },
    perfil: { type: DataTypes.STRING, allowNull: true },
    operacao: { type: DataTypes.STRING, allowNull: false },
    recurso: { type: DataTypes.STRING, allowNull: false },
    recurso_id: { type: DataTypes.STRING, allowNull: true },
    detalhes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'auditoria',
    tableName: 'auditoria',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false,
    indexes: [{ fields: ['criado_em'] }, { fields: ['operacao'] }, { fields: ['recurso'] }],
  },
);

export default Auditoria;
