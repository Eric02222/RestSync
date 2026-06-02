# Roteiro de demonstração — RestSync (Hackathon)

## Subir o projeto (manual)

```bash
# Terminal 1 — Backend (porta 3001)
cd RestSync_BackEnd && npm install && cp .env.example .env && npm run dev

# Terminal 2 — Frontend (porta 5173)
cd RestSync_FrontEnd && npm install && npm run dev
```

Abra: http://localhost:5173

Se o familiar não vir residentes, rode no MySQL:

```sql
INSERT IGNORE INTO vinculo_usuario_paciente (paciente_id, usuario_id) VALUES (1, 3);
```

(O `init.sql` já inclui esse vínculo em instalações novas.)

---

## Contas de teste

| Perfil   | E-mail                 | Senha        |
|----------|------------------------|--------------|
| Admin    | admin@restsync.com     | admin123     |
| Médico   | medico@restsync.com    | medico123    |
| Familiar | familiar@restsync.com  | familiar123  |

Residente seed: **Geraldo Magela de Souza** (id 1), com histórico de vitais do dia.

---

## Roteiro (8 minutos)

### 1. Problema (30s)
“Famílias e equipes de repouso precisam saber **agora** quando um sinal vital sai do normal.”

### 2. Admin / Médico — Dashboard (3 min)
1. Login `medico@restsync.com`
2. **Dashboard** → residente **Geraldo**
3. Mostrar métricas + gráfico (leitura de atenção no seed)
4. **Simular Dispositivo** → preset **Crítico** → Injetar
5. Sistema atualiza KPIs; se crítico, redireciona para **Alertas**
6. Mostrar alerta de FC/temperatura

### 3. Familiar — vínculo emocional (3 min)
1. Logout → login `familiar@restsync.com`
2. **Dashboard** — só vê o Geraldo (vínculo)
3. **Histórico** — tabela e gráfico
4. **Alertas** — mesma leitura crítica (somente visualização; sem botões de ação)

### 4. Fechamento (1 min)
“RestSync conecta a casa de repouso à família com monitoramento e alertas claros — pronto para integrar dispositivos reais.”

---

## O que evitar na demo

- Não abrir **Usuários** ou **Auditoria** (administrativo)
- Não prometer WebSocket se não estiver na tela
- Familiar **não** vê o simulador IoT nem a gestão de Residentes (apenas admin/médico)
