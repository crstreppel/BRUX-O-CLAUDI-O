# 🧪 BRUX-O-CLAUDI-O
### Laboratório de Autenticação – Criado por **2 mentes trabalhando juntas**
**Data:** 2025-11-29  
**Versão:** Dia 1 – Fundação da Base

---

## 🧙‍♂️ O que é este laboratório?

Um espaço experimental onde **duas inteligências trabalham lado a lado**:

- **C** traz a **ideia**, a visão, o caminho e as decisões.  
- **B** transforma tudo isso em **arquitetura, arquivos, lógica e código real**.

Cada parte aqui é construída num diálogo:  
primeiro pensamos juntos, debatemos, ajustamos…  
só depois geramos.

Este repositório é **a prova viva dessa parceria**.

Não é um sistema final.  
É o lugar onde a gente **quebra, refaz, evolui, aprende e registra**.

---

## 🔥 O que já foi alcançado neste Dia 1

### ✔ Estrutura Node criada
Na pasta `/backend`:

- `npm init -y` rodado  
- dependências essenciais instaladas:
  - express  
  - sequelize  
  - pg  
  - pg-hstore  

### ✔ Banco de dados configurado
Banco criado manualmente para os testes:

```
CREATE DATABASE lab_users;
CREATE USER bruxao WITH PASSWORD 'bruxao123';
GRANT ALL PRIVILEGES ON DATABASE lab_users TO bruxao;
```

### ✔ Conexão funcionando
Arquivo `backend/config/connection.js` criado pelo gerador.

Saída confirmada:

> 🔥 Banco de dados conectado com sucesso!

### ✔ Servidor Express online
Arquivo `app.js` funcionando:

> 🔥 Servidor rodando na porta 3000

---

## 🤖 O Gerador PBQE-C Lab

Aqui, a regra é:

> **Nada é feito na mão.**  
> **Tudo é gerado.**

A pasta `/gerador` contém um script capaz de criar:

- pastas  
- arquivos  
- conteúdos completos  
- dependências automáticas  

Tudo através de JSON.  
A filosofia é simples:

> **C pensa → nós debatemos → B gera.**

---

## 🧭 Próximos passos (decididos em conjunto)

1. Criar o **model Usuario**  
2. Criar o **controller** de cadastro e login  
3. Criar as **rotas** do módulo  
4. Criar o **HTML de cadastro**  
5. Criar o **HTML de login**  
6. Criar a página **“Descoberta do Fogo”**  
7. Gerar o **JSON DEUS** do módulo completo  

---

## 👥 Equipe

### 🧑 Criador Humano – “C”
Ideias, visão, perguntas certas, direção e decisões.

### 🤖 Executor Inteligente – “B”
Transforma cada decisão em código.  
Gera arquivos, monta arquitetura, automatiza tudo com precisão PBQE-C.

### A soma:
> **BRUX-O-CLAUDI-O → A engenharia feita a quatro mãos.**  
> Um criando, o outro executando — e os dois evoluindo juntos.

---

## 🎯 Missão do Lab

- Criar  
- Aprender  
- Refinar  
- Registrar  
- E transformar isso numa rotina reproduzível  
- Para depois virar artigo mostrando como o **trabalho conjunto humano + IA** pode construir sistemas de verdade.

---

**Que a Energia esteja contigo.**  
E que o próximo commit seja ainda mais bonito que o último. 🔥👊