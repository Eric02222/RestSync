# RestSync 🏥

> **Conectando o cuidado à tranquilidade familiar através de dados em tempo real.**

O **RestSync** é uma plataforma de monitoramento inteligente desenvolvida para casas de repouso. O sistema centraliza dados coletados de dispositivos médicos e sensores, transformando-os em relatórios acessíveis e intuitivos para que familiares e profissionais acompanhem o bem-estar dos residentes em tempo real.

---

## ✨ Recursos e Inovações

RestSync foi projetado com foco em **UX de Alta Fidelidade**, oferecendo uma experiência moderna e eficiente para gerenciamento de casas de repouso:

*   **Monitoramento Intuitivo em Tempo Real:**
    *   **Dashboard Clínico Completo:** Visualize indicadores de saúde vitais, gráficos dinâmicos e uma central de alertas reativa.
    *   **Simulador de Dispositivo IoT Integrado:** Demonstração interativa da injeção de dados médicos mockados, gerando alertas e atualizações em tempo real.
    *   **Central de Alertas Dinâmicos:** Gerenciamento de alertas dos dados vitais, com status (Novo/Visualizado/Resolvido) e capacidade de overrides locais.

*   **Gestão Abrangente de Usuários e Residentes:**
    *   **Painel de Usuários (CRUD):** Administração completa de usuários, incluindo criação, leitura, atualização e exclusão, com proteção contra auto-exclusão para admins.
    *   **Gestão de Residentes (CRUD):** Tela administrativa robusta com busca integrada, cartões organizados e formulários para o gerenciamento de pacientes.
    *   **Vínculo Familiar <> Residente:** Gerencie os laços entre familiares e pacientes, permitindo que familiares visualizem apenas os dados de seus entes queridos.
    *   **Perfil do Usuário:** Página dedicada para visualização e edição das informações do usuário logado.

*   **Controle de Acesso Robusto:**
    *   **Sistema de Permissões no Frontend:** A navegação e as funcionalidades são filtradas dinamicamente com base no `tipo_usuario` (Admin, Médico/Cuidador, Familiar).
    *   **Rotas Protegidas:** Utilização de `ProtectedRoute` com `allowedRoles` para garantir que apenas usuários autorizados acessem determinadas seções (ex: `/usuarios` e `/logs` apenas para admins).
    *   **Fluxo de Sessão Seguro:** Provedor global `AuthContext` com interceptores Axios para controle de acesso e deslogamento automático em caso de expiração do token.

*   **Experiência do Usuário Aprimorada:**
    *   **Visual Premium & Acessibilidade:** Interface moderna inspirada na estética Apple Health, com paleta de cores semânticas, tipografia `Inter` e efeitos `Glassmorphism`.
    *   **Tela de Login Minimalista:** Design limpo e responsivo com controle de carregamento e toasts de validação.

*   **Auditoria e Histórico:**
    *   **Histórico e Relatórios:** Tabela detalhada de medições clínicas anteriores com badges de status de risco.
    *   **Auditoria (Logs):** Histórico real de logins, cadastros e alterações (somente admin).

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | React / Tailwind CSS / Recharts / Lucide Icons / React Router |
| **Backend** | Node.js / Express |
| **Banco de Dados** | MySQL 8.0 |
| **Orquestração** | Docker / Docker Compose |

---

## 🐳 Como Executar com Docker Compose (Recomendado)

Disponibilizamos uma configuração completa do Docker Compose que empacota o Frontend React, o Backend Node e o Banco de Dados MySQL com auto-inicialização. Não é necessário instalar nenhuma dependência localmente.

### 1. Iniciar os Serviços
Na pasta raiz do projeto (`RestSync`), execute:
```bash
docker-compose up --build -d
```
*Este comando baixa as imagens, compila o frontend React, configura o banco MySQL e carrega as sementes (seeds) de teste.*

### 2. Acessar a Aplicação
* **Interface Frontend (React):** Acesse [http://localhost:8000](http://localhost:8000) (Servido via Vite).
* **API Backend (Express):** Acesse [http://localhost:3001](http://localhost:3001).
* **Banco de Dados (MySQL):** Rodando em `localhost:3366` (Porta externa exposta).

### 3. Contas de Teste Pré-Configuradas (Seeds)
O banco de dados é automaticamente inicializado com o residente **Geraldo Magela de Souza**, histórico clínico inicial e três perfis de usuários prontos para uso:

*   **Administrador:** `admin@restsync.com` / Senha: `admin123`
*   **Médico / Cuidador:** `medico@restsync.com` / Senha: `medico123`
*   **Familiar:** `familiar@restsync.com` / Senha: `familiar123`

### 4. Parar a Aplicação
Para parar os contêineres e remover os volumes de dados persistidos, execute:
```bash
docker-compose down -v
```

---

## ⚙️ Execução Local Sem Docker (Manual)

Se preferir rodar cada serviço individualmente em seu ambiente de desenvolvimento local:

1.  **Configurar e Rodar o Banco de Dados:**
    *   Crie uma instância MySQL chamada `restsync_db`.
    *   Execute o script de criação [init.sql](file:///Users/yknwo/Desktop/RestSync/RestSync_BackEnd/src/config/init.sql) para estruturar as tabelas e seeds.

2.  **Rodar o Backend** (porta **3001**):
    ```bash
    cd RestSync_BackEnd
    npm install
    cp .env.example .env   # ajuste DB_PASSWORD se necessário
    npm run dev
    ```

3.  **Rodar o Frontend** (porta **5173**, API via proxy `/api`):
    ```bash
    cd RestSync_FrontEnd
    npm install
    npm run dev
    ```
    *Acesse http://localhost:5173 — as chamadas vão para o backend em :3001 automaticamente.*

    Se você tiver um `.env` local com `VITE_API_URL=http://localhost:8000`, apague ou corrija para `/api` ou `http://localhost:3001`.
