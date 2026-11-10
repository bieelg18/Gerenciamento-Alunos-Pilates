ALTER TABLE tb_professor
ADD CONSTRAINT fk_professor_estudio
FOREIGN KEY (estudio_id)
REFERENCES tb_estudio(id);

ALTER TABLE tb_aluno
ADD CONSTRAINT fk_aluno_estudio
FOREIGN KEY (estudio_id)
REFERENCES tb_estudio(id);