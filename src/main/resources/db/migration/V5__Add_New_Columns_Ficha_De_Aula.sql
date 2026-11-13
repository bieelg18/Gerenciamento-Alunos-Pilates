ALTER TABLE tb_fichas
ADD COLUMN respiracao TEXT;

ALTER TABLE tb_fichas
ADD COLUMN concentracao TEXT;

ALTER TABLE tb_fichas
ADD COLUMN precisao TEXT;

ALTER TABLE tb_fichas
ADD COLUMN fluidez TEXT;

ALTER TABLE tb_fichas
ADD COLUMN controle TEXT;

CREATE TABLE tb_acessorios_ficha(
    ficha_aula_id INTEGER NOT NULL,
    acessorio VARCHAR(100) NOT NULL,

    CONSTRAINT fk_acessorios_ficha
                                FOREIGN KEY (ficha_aula_id)
                                REFERENCES tb_fichas(id)
);