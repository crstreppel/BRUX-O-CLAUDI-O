
CREATE TABLE IF NOT EXISTS entidades.enderecos (
    id UUID PRIMARY KEY,
    entidade_id UUID NOT NULL,
    sequencia INTEGER NOT NULL,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    condominio VARCHAR(100),
    edificio VARCHAR(100),
    bloco VARCHAR(50),
    unidade VARCHAR(50),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    pais VARCHAR(50) NOT NULL DEFAULT 'BR',
    status_id UUID NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT fk_enderecos_entidade
        FOREIGN KEY (entidade_id)
        REFERENCES entidades.entidades(id),

    CONSTRAINT fk_enderecos_status
        FOREIGN KEY (status_id)
        REFERENCES public.status(id)
);

CREATE INDEX idx_enderecos_entidade
    ON entidades.enderecos(entidade_id);

CREATE INDEX idx_enderecos_ativo
    ON entidades.enderecos(ativo);
