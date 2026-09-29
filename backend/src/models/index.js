import Aluno from './Aluno.js';
import Turma from './Turma.js';
import Nota from './Nota.js';
import Frequencia from './Frequencia.js';
import Usuario from './Usuario.js';
import Auditoria from './Auditoria.js';

Turma.hasMany(Aluno, {
  foreignKey: 'turma_id',
  as: 'alunos',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Aluno.belongsTo(Turma, { foreignKey: 'turma_id', as: 'turma' });

Aluno.hasMany(Nota, {
  foreignKey: 'aluno_id',
  as: 'notas',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Nota.belongsTo(Aluno, { foreignKey: 'aluno_id', as: 'aluno' });

Aluno.hasMany(Frequencia, {
  foreignKey: 'aluno_id',
  as: 'frequencias',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Frequencia.belongsTo(Aluno, { foreignKey: 'aluno_id', as: 'aluno' });

Aluno.hasOne(Usuario, { foreignKey: 'aluno_id', as: 'conta' });
Usuario.belongsTo(Aluno, { foreignKey: 'aluno_id', as: 'aluno' });

export { Aluno, Turma, Nota, Frequencia, Usuario, Auditoria };
