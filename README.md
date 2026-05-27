# RestSync 🏥

> **Conectando o cuidado à tranquilidade familiar através de dados em tempo real.**

O **RestSync** é uma plataforma de monitoramento inteligente desenvolvida para casas de repouso. O sistema centraliza dados coletados de dispositivos médicos e sensores, transformando-os em relatórios acessíveis e intuitivos para que familiares possam acompanhar o bem-estar dos residentes em tempo real.

---

## 🚀 Sobre o Projeto

A comunicação entre casas de repouso e familiares muitas vezes é fragmentada. O RestSync elimina esse hiato tecnológico, automatizando a coleta de sinais vitais e gerando um canal direto de transparência.

### Principais Funcionalidades:
* **Integração com Equipamentos:** Captura automática de dados (frequência cardíaca, oxigenação, temperatura, pressão arterial).
* **Relatórios de Estado:** Visualização clara do histórico de saúde e atividades do residente.
* **Alertas Inteligentes:** Notificações automáticas em caso de variações bruscas nos sinais monitorados.
* **Dashboard para Familiares:** Interface amigável focada na leitura rápida de dados complexos.
* **Gestão de Internação:** Painel administrativo para a equipe de saúde gerenciar múltiplos pacientes.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | React / Tailwind CSS |
| **Backend** | Node.js |
| **Banco de Dados** | MySQL |
| **Protocolos** | HTTP REST |

---

## 📈 Como funciona?

1. **Coleta:** Os equipamentos médicos enviam os dados via protocolo seguro.
2. **Processamento:** O backend do RestSync processa os dados brutos e verifica anomalias.
3. **Visualização:** O familiar acessa o aplicativo e visualiza o relatório consolidado do dia/semana.

---

## ⚙️ Instalação e Execução

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/restsync.git](https://github.com/seu-usuario/restsync.git)

# Entre na pasta do projeto
cd restsync

# Instale as dependências
npm install

# Inicie o ambiente de desenvolvimento
npm run dev
