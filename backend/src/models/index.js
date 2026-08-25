import Aluno from './Aluno.js';
import Turma from './Turma.js';

// Uma turma pode ter muitos alunos; cada aluno pertence a no maximo uma turma.
Turma.hasMany(Aluno, {
  foreignKey: 'turma_id',
  as: 'alunos',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
Aluno.belongsTo(Turma, { foreignKey: 'turma_id', as: 'turma' });

export { Aluno, Turma };
