# 🌳 Árvore Genealógica — janer.com.br/arvore

**Deployed:** 17/02/2026  
**URL:** https://www.janer.com.br/arvore

---

## 📊 Resumo

Interface web interativa para visualizar a genealogia Janér-Melegari com **70 pessoas catalogadas** desde 1669 (Georg Wilhelm Fleetwood) até 2006 (Henrique).

---

## ✨ Funcionalidades

### 1. Visualização Hierárquica
- **Bisavós** → **Avós** → **Pais** → **Casal** → **Filhos**
- Seção separada para Família Melegari (lado Andrea)
- Cores por geração para navegação visual

### 2. Busca Inteligente
- Campo de busca em tempo real
- Busca por nome completo ou parcial
- Resultados instantâneos

### 3. Cartões Detalhados (Modal)
- Clique em qualquer pessoa para ver:
  - Nome completo
  - Datas e locais (nascimento/falecimento)
  - Notas biográficas
  - **Links navegáveis** para pais, cônjuges e filhos

### 4. Mobile-Friendly
- Grid responsivo
- Touch-friendly
- Scrolling suave

---

## 📁 Estrutura Técnica

```
janer-viagens/
└── src/app/arvore/
    ├── data.ts       # 70 pessoas + helpers de navegação
    └── page.tsx      # Interface React + modal
```

### Principais helpers em `data.ts`:
- `getPerson(id)` — buscar pessoa por ID
- `getParents(id)` — retornar array de pais
- `getChildren(id)` — retornar array de filhos
- `getSpouses(id)` — retornar array de cônjuges

---

## 🎨 Design

**Cores por geração:**
- 🟡 Bisavós: `amber-50`
- 🔵 Avós: `blue-50`
- 🟢 Pais: `green-50`
- 🟣 Casal: `purple-50`
- 🔴 Filhos: `pink-50`
- 💜 Melegari: `indigo-50`

**Layout:**
- Cards 3-8 por linha (responsive grid)
- Modal centralizado com scroll
- Background overlay para foco

---

## 📈 Estatísticas

- **70 pessoas** catalogadas
- **9 gerações** mapeadas
- **Geração mais antiga:** Georg Wilhelm Fleetwood (1669-1728)
- **Origens:**
  - 🇸🇪 Suécia (Janér, Montelius, Kylberg, Raab, Fleetwood)
  - 🇵🇹 Portugal (Verda Burnay, Mello y Castro, Lencastre)
  - 🇪🇸 Espanha (Verda y Gomé)
  - 🇧🇷 Brasil (Gabizo de Faria, Franco de Sá, Ramos, Arruda, Castro)
  - 🇮🇹 Itália (Melegaro/Melegari — Verona)
  - 🇸🇾 Síria (Garib)

---

## 🏛️ Títulos Nobiliárquicos

Famílias com títulos documentados:
- **1º Conde de Burnay** — Henrique Burnay (1838-1909)
- **1º Visconde de Mairos** — D. Luiz de Verda y Gomé (1850-1922)
- **9º Conde das Galveias** — José de Avilez de Almeida Mello y Castro (1872)
- **Família Fleetwood** — Nobreza sueca desde século XVII

---

## 🚀 Próximas Melhorias (Opcional)

1. **Upload de fotos** — adicionar avatares para cada pessoa
2. **Export PDF** — gerar árvore impressa
3. **Timeline** — visualização cronológica
4. **Grafo interativo** — visualização em rede (vis-network)
5. **Links externos** — integração com Ancestry/FamilySearch
6. **Edição online** — permitir família adicionar/editar dados

---

## 🔗 Links Úteis

- **Site:** https://www.janer.com.br/arvore
- **Viagens:** https://www.janer.com.br/viagens
- **Senha:** `familiatoda`

---

*Desenvolvido por Tyr ⚡ — 17/02/2026*
