<div align="center">

<img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/Logoorbee.png" alt="Orbee Logo" width="180px" />

<br/>
<br/>

<img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/home.png" alt="Orbee Dashboard" width="100%" />

# 🐝 Orbee — Productivity Ecosystem

**Orbit. Organize. Produce.**

*Para a mulher que está sempre em movimento — entre reuniões, refeições, sonhos e prazos.*

[![Deploy Frontend](https://img.shields.io/badge/Vercel-Frontend-black?style=flat-square&logo=vercel)](https://orbee-web-hazel.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render)](https://orbee.onrender.com)
[![Banco de Dados](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)

</div>

---

## ✨ A História

O nome **OrBee** não foi escolhido por acaso.

**Or** vem de *orbit* — tudo ao redor de um centro que nunca para. A carreira, a família, os projetos pessoais, a saúde, os sonhos. A vida de uma mulher moderna é exatamente isso: múltiplos mundos girando ao mesmo tempo, todos exigindo atenção, todos importando.

**Bee** vem de *abelha* — símbolo universal de produtividade, colaboração e propósito. A abelha não trabalha por obrigação. Ela trabalha porque o que produz tem valor, nutre e sustenta.

O **OrBee** nasceu da necessidade real de uma ferramenta que entendesse essa realidade: que o mesmo app precisa te ajudar a lembrar da reunião das 14h, da consulta do médico da semana que vem, da meta de leitura do mês e do projeto que você construiu sozinha do zero.

Não é só um gerenciador de tarefas. É o centro da sua órbita.

---

## 📸 Screenshots

<div align="center">

| Home | Cadastro | Notas |
|---|---|---|
| <img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/home.png" width="250"/> | <img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/cadastroOrBee.png" width="250"/> | <img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/notas.png" width="250"/> |

| Receitas | Insights | Mobile |
|---|---|---|
| <img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/receitas.png" width="250"/> | <img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/insightMensal.png" width="250"/> | <img src="https://raw.githubusercontent.com/Alexandra-Almeida-DV/OrBee/main/orbee-web/src/ativos/celular.png" width="250"/> |

</div>

---

## 🚀 Funcionalidades

- **Kanban inteligente** — colunas personalizáveis, prioridades e prazos
- **Gestão de projetos** — acompanhamento de progresso com horas de estudo e metas
- **Notas rápidas** — captura de ideias com categorias e cores
- **Metas mensais** — acompanhamento visual de objetivos com valor atual vs. meta
- **Receitas** — sua coleção pessoal com categorias e imagens
- **Notificações inteligentes** — alertas de tarefas atrasadas e com vencimento no dia
- **Perfil completo** — foto, bio e preferências personalizadas
- **Analytics** — visão geral da sua produtividade mensal
- **Responsivo** — experiência completa no mobile

---

## 🛠️ Stack Tecnológica

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 + Vite | Interface e HMR instantâneo |
| TypeScript | Tipagem estática e escalabilidade |
| Tailwind CSS | Estilização utilitária responsiva |
| Framer Motion | Animações fluidas e transições |
| Axios | Comunicação com a API |
| Lucide React | Iconografia moderna e leve |
| React Router DOM | Navegação entre páginas |

### Backend
| Tecnologia | Uso |
|---|---|
| Python 3.11+ | Linguagem principal |
| FastAPI | API de alta performance |
| SQLAlchemy | ORM e modelagem de dados |
| Pydantic v2 | Validação de schemas |
| JWT (python-jose) | Autenticação stateless |
| Passlib + Bcrypt | Hash seguro de senhas |
| Cloudinary | Upload e hospedagem de imagens |
| Python-dotenv | Gerenciamento de variáveis de ambiente |

### Infraestrutura
| Serviço | Função |
|---|---|
| Vercel | Deploy do frontend |
| Render | Deploy do backend |
| Supabase (PostgreSQL) | Banco de dados em produção |

---

## 🏗️ Arquitetura

```
OrBee/
├── orbee-web/                  # Frontend
│   ├── src/
│   │   ├── ativos/             # Imagens e recursos estáticos
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── contexts/           # Contextos React (auth, tema, efeitos)
│   │   ├── hooks/              # Hooks customizados
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── routes/             # Configuração de rotas
│   │   └── services/           # Camada de comunicação com a API
│
└── orbee-api/                  # Backend
    └── app/
        ├── core/               # Database, config, segurança
        ├── models/             # Modelos SQLAlchemy
        ├── routes/             # Endpoints FastAPI
        ├── schemas/            # Schemas Pydantic
        └── services/           # Regras de negócio
```

---

## ⚙️ Como rodar localmente

### Frontend

```bash
# Clone o repositório
git clone https://github.com/Alexandra-Almeida-DV/OrBee.git
cd OrBee/orbee-web

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# edite com a URL do backend

# Rode o projeto
npm run dev
```

---

## 🔐 Variáveis de Ambiente

### Frontend (`.env.local`)
```dotenv
VITE_API_URL=https://orbee.onrender.com
```

---

## 📡 Deploy

| Camada | Plataforma | Trigger |
|---|---|---|
| Frontend | Vercel | Push na branch `main` |
| Backend | Render | Push na branch `main` |
| Banco | Supabase | Tabelas criadas via SQL Editor |

---

## 🎨 Design

O OrBee foi construído com a estética **Glassmorphism** — superfícies translúcidas, sombras suaves e uma paleta roxa/lilás que remete ao foco e à clareza mental. As animações com **Framer Motion** tornam cada transição fluida e intencional.

Cada detalhe foi pensado para que o app seja bonito o suficiente para você querer abrir, e funcional o suficiente para te fazer produtiva quando abrir.

---

## 👩‍💻 Autora

Feito com propósito por **Alexandra Almeida**

*"Construído por uma mulher, para mulheres que não param."*

[![GitHub](https://img.shields.io/badge/GitHub-Alexandra--Almeida--DV-181717?style=flat-square&logo=github)](https://github.com/Alexandra-Almeida-DV)

---

<div align="center">
  <sub>OrBee © 2025 — Sempre em órbita. Sempre produzindo. 🐝</sub>
</div>

