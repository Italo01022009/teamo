# 🎯 Guia Rápido - Novas Funcionalidades TEAmo

## 🚀 O que foi implementado?

### Para **Profissionais:**

#### 1. 📸 Novo Perfil (com Foto + Bio + Especialidade)
**Onde:** Menu → Perfil

```
✨ Foto de perfil circular com botão de câmera
📝 Bio com até 300 caracteres
🎓 Campo "Especialidade / Formação"
⭐ Seção "Avalie o TEAmo" com avaliação textual
🚪 Botão "Sair da conta"
```

**Como usar:**
1. Clique em "Meu Perfil"
2. Clique em "Editar Perfil"
3. Adicione foto (clique na câmera)
4. Preencha Bio e Especialidade
5. Clique "Salvar"

---

#### 2. 📋 Detalhes Completos das Sessões
**Onde:** Sessões → Clique em "Ver detalhes"

```
📊 Gráfico de desempenho (Atenção, Comunicação, Participação)
🎯 Objetivos da sessão
🎨 Atividades realizadas
😊 Comportamento observado
💡 Estratégias utilizadas
🏠 Recomendações para casa
```

**Como usar:**
1. Vá para "Sessões"
2. Clique em "Ver detalhes" de qualquer sessão
3. Analise todo o conteúdo estruturado

---

#### 3. 📊 Relatórios com Gráficos
**Onde:** Menu → Relatórios

```
🔽 Filtro 1: Selecione uma criança
🔽 Filtro 2: Período (7/30/90/365 dias)

📈 Gráfico 1: Humor ao longo dos dias (linha)
📊 Gráfico 2: Frequência de comportamentos (barras)
🥧 Gráfico 3: Evolução nas sessões (pizza)
🍽️ Gráfico 4: Sono e alimentação (barras)
```

**Como usar:**
1. Vá para "Relatórios"
2. Selecione a criança desejada
3. Escolha o período a analisar
4. Veja os gráficos e análises automáticas

---

#### 4. 📄 Gerador de Relatório ABNT em PDF
**Onde:** Relatórios → Botão "Gerar relatório"

```
✅ Gera PDF profissional conforme ABNT
✅ Inclui informações da criança
✅ Análise do período selecionado
✅ Baixa automaticamente
```

**Como usar:**
1. Vá para "Relatórios"
2. Selecione UMA criança específica (não "Todas")
3. Clique em "Gerar relatório"
4. O PDF fará download automaticamente
5. Personalize conforme necessário

---

## 📱 Visão do Responsável

Para responsáveis, o perfil também foi atualizado com:
- Foto de perfil
- Bio (sem especialidade)
- Mesma interface limpa

---

## ⚙️ Configuração Necessária (IMPORTANTE!)

### **Você precisa fazer isso ANTES de usar:**

1. **Abra o Supabase Dashboard**
2. **Vá para SQL Editor**
3. **Cole o arquivo `DATABASE_MIGRATION.sql`**
4. **Clique em Run**
5. **Vá para Storage → Create Bucket:**
   - Nome: `profiles`
   - Público: ✅ SIM
   - Criar

---

## 🎨 Customizações Possíveis

Todos os arquivos estão prontos para customizar:

- **Cores dos gráficos** → `app/app/relatorios/page.tsx` (procure por `color:`)
- **Limite de Bio** → Mude `300` para outro valor
- **Template do relatório ABNT** → `app/app/relatorios/page.tsx` (função `generateABNTReport`)
- **Tipos de atividades/comportamentos** → Implemente um CRUD em `app/app/sessoes/nova/page.tsx`

---

## 💡 Dicas

✨ **Dica 1:** Os gráficos atualizam automaticamente quando você filtra
✨ **Dica 2:** Relatórios ABNT precisam de pelo menos 1 sessão registrada
✨ **Dica 3:** Bio mostra contador de caracteres em tempo real
✨ **Dica 4:** Foto é opcional - vem com ícone padrão se não adicionar

---

## 🆘 Problemas Comuns?

❌ **"Coluna não encontrada"**
→ Execute o SQL no Supabase

❌ **"Foto não aparece"**
→ Verifique se o bucket `profiles` está público

❌ **"Erro ao gerar PDF"**
→ Verifique se selecionou uma criança específica

---

**Pronto! Explore as novas funcionalidades! 🎉**
