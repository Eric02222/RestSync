# RestSync 🏥

> **Conectando o cuidado à tranquilidade familiar através de dados em tempo real.**

O **RestSync** é uma plataforma de monitoramento inteligente desenvolvida para casas de repouso. O sistema centraliza dados coletados de dispositivos médicos e sensores, transformando-os em relatórios acessíveis e intuitivos para que familiares e profissionais acompanhem o bem-estar dos residentes em tempo real.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | React / Tailwind CSS / Recharts / Lucide Icons / React Router |
| **Backend** | Node.js / Express |
| **Banco de Dados** | MySQL 8.0 |
| **Orquestração** | Docker / Docker Compose |

---

## ✨ Melhorias Implementadas (MVP Acadêmico)

Reestruturamos e finalizamos a interface e conexões do front-end com foco em **UX de Alta Fidelidade (inspirado na estética Apple Health)**:

* **Visual Premium & Acessibilidade:** Paleta de cores semânticas nítida (Azul, Verde, Amarelo e Vermelho), tipografia modernizada (Inter), painéis de efeito vidro (*Glassmorphism*) e micro-animações interativas de foco.
* **Dashboard Clínico Completo:** dropdown de seleção ativa de idosos, grade responsiva de 4 cartões com indicadores de saúde, gráfico temporal Recharts dinâmico com alternador de métricas (Frequência Cardíaca e Temperatura) e central de alertas reativa.
* **Simulador de Dispositivo IoT Integrado:** Painel interativo no Dashboard que permite injetar medições médicas mockadas diretamente no banco de dados para demonstrar alertas imediatos e atualizações em tempo real ao vivo na apresentação.
* **Gestão de Residentes (CRUD):** Tela administrativa com busca integrada, cartões organizados e formulário em modal com aplicação de máscaras nativas de CPF e Telefone.
* **Histórico e Relatórios:** Tabela detalhada de medições clínicas anteriores com badges de status de risco e marcadores temporais.
* **Fluxo de Sessão Seguro:** Provedor global `AuthContext` interligado a interceptores Axios que controlam acessos por permissão e realizam deslogamento em tempo de execução no caso de expiração do Token.
* **Tela de Login Minimalista:** Visual limpo e responsivo integrado com controle de carregamento e toasts de validação.

---

## 🐳 Como Executar com Docker Compose (Recomendado)

Disponibilizamos uma configuração completa do Docker Compose que empacota o Frontend no Nginx, o Backend Node e o Banco de Dados MySQL com auto-inicialização. Não é necessário instalar nenhuma dependência localmente.

### 1. Iniciar os Serviços
Na pasta raiz do projeto (`RestSync`), execute:
```bash
docker-compose up --build -d
```
*Este comando baixa as imagens, compila o frontend React com o Nginx, configura o banco MySQL e carrega as sementes (seeds) de teste.*

### 2. Acessar a Aplicação
* **Interface Frontend (React):** Acesse [http://localhost](http://localhost) (Servido via porta padrão 80 do Nginx, com suporte a SPA routing).
* **API Backend (Express):** Acesse [http://localhost:8000](http://localhost:8000).
* **Banco de Dados (MySQL):** Rodando em `localhost:3306` (Porta externa exposta).

### 3. Contas de Teste Pré-Configuradas (Seeds)
O banco de dados é automaticamente inicializado com o residente **Geraldo Magela de Souza**, histórico clínico inicial e três perfis de usuários prontos para uso:

* **Administrador:** `admin@restsync.com` / Senha: `admin123`
* **Médico / Cuidador:** `medico@restsync.com` / Senha: `medico123`
* **Familiar:** `familiar@restsync.com` / Senha: `familiar123`

### 4. Parar a Aplicação
Para parar os contêineres e remover os volumes de dados persistidos, execute:
```bash
docker-compose down -v
```

---

## ⚙️ Execução Local Sem Docker (Manual)

Se preferir rodar cada serviço individualmente em seu ambiente de desenvolvimento local:

1. **Configurar e Rodar o Banco de Dados:**
   * Crie uma instância MySQL chamada `restsync_db`.
   * Execute o script de criação [init.sql](file:///Users/yknwo/Desktop/RestSync/RestSync_BackEnd/src/config/init.sql) para estruturar as tabelas e seeds.

2. **Rodar o Backend:**
   ```bash
   cd RestSync_BackEnd
   npm install
   # Configure o arquivo .env conforme o env.example.js
   npm run dev
   ```

3. **Rodar o Frontend:**
   ```bash
   cd RestSync_FrontEnd
   npm install
   npm run dev
   ```
   *Acesse a URL de desenvolvimento fornecida pelo Vite (geralmente http://localhost:5173).*
