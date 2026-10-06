# Caso 09 — Página de cidade, Brightfield Solar

**Tempo dedicado:** aproximadamente 5 horas

Landing page de energia solar que muda de conteúdo conforme a cidade da URL (`/phoenix-az`, `/austin-tx`). Cada seção foi implementada a partir dos frames do Figma (mobile e desktop) como um único componente responsivo, e todo texto e número que varia por cidade vem de um arquivo JSON.

## Como instalar e rodar

Requisitos: Node.js 20 ou superior e npm.

```bash
npm install      # instala as dependências
npm run dev      # servidor de desenvolvimento em http://localhost:3000
npm test         # roda os testes (Vitest)
```

Outros comandos úteis:

```bash
npm run build    # build de produção (gera uma página estática por cidade)
npm run lint     # ESLint
```

A raiz `/` redireciona para `/phoenix-az`.

## Estrutura do projeto

```
data/cities/          um arquivo JSON por cidade (phoenix-az.json, austin-tx.json)
lib/
  cities.ts           getCity(slug) e getAllCitySlugs()
  calculate.ts        cálculo do simulador (painéis, investimento, economia, retorno)
  calculate.test.ts   testes do cálculo
  types.ts            tipo City e tipos auxiliares
src/
  app/
    [city]/page.tsx   página dinâmica, generateStaticParams e generateMetadata
    globals.css       tokens de design (cores, tamanhos de texto, fontes)
  components/         Hero, Simulador, Passos, ProvaSocial, FAQ, ChamadaFinal
public/images/        imagens e ícones de cada seção
```

### Como adicionar uma cidade nova

1. Crie `data/cities/<slug>.json`, por exemplo `data/cities/denver-co.json`, com o mesmo formato dos arquivos existentes (veja o tipo `City` em `lib/types.ts`). O campo `slug` deve ser igual ao nome do arquivo.
2. Pronto: `getAllCitySlugs()` lê a pasta, então a rota `/denver-co` passa a existir no próximo `npm run dev` ou `npm run build`, com título e descrição próprios. Nenhum código precisa mudar.

Um slug que não tem arquivo retorna 404.

## Decisões técnicas

- **Next.js (App Router) com páginas estáticas.** `generateStaticParams` gera uma página por arquivo em `data/cities`. Os dados são lidos no servidor, então nada de cidade vai para o bundle do cliente.
- **Dados fora do código.** Os componentes recebem `city: City` por props tipadas e não têm texto fixo de cidade. Os números do simulador (tarifa, horas de sol, custo por watt, mínimo de painéis, crédito federal) vêm do JSON.
- **Mobile first.** O estilo base segue o frame mobile e o prefixo `lg:` aplica o desktop, sem duplicar conteúdo em versões escondidas. Como o Figma só tem dois frames, usei `lg:` (1024 px) em vez de `md:`, porque as grades de três colunas ficam apertadas em 768 px.
- **Tailwind 4 com tokens.** Cores, tamanhos de texto e fontes ficam em `globals.css`.
- **Cálculo isolado e testado.** `lib/calculate.ts` é uma função pura, coberta por testes em `lib/calculate.test.ts`.
- **Acessibilidade.** HTML semântico (`section`, hierarquia de títulos, `nav`, `footer`), `alt` nas imagens, foco visível, FAQ como acordeão com `aria-expanded` e menu mobile com `aria-expanded` e fechamento por Esc.

## Duas decisões que tomei

### 1. Não confiar só nos testes gerados pela IA
Pedi ao agente a função de cálculo e os testes. Os 4 testes que ele escreveu passaram,
mas verificavam comportamentos (mínimo, teto, arredondamento, entradas inválidas) e não
os números do briefing. Como código e testes saíram da mesma fonte, eu queria uma
verificação independente. Adicionei os 6 cenários da tabela de exemplo, com painéis,
investimento, economia e retorno esperados. Todos os cenários passaram, o que confirma de forma independente que a função segue as regras do briefing, incluindo o mínimo de painéis e o teto da economia. Também percebi que testes escritos pela mesma fonte do código tendem a validar a própria lógica, e por isso usei valores externos.

### 2. Testar o requisito "trocar o arquivo, trocar a cidade"
Queria confirmar que uma cidade nova é só um arquivo novo. Copiei `phoenix-az.json`
para `austin-tx.json`, mudei cidade, tarifa, horas de sol, mínimo de painéis, telefone e
nome das equipes, e abri `/austin-tx`. Também busquei "Phoenix" nos componentes. A página
mudou por inteiro e a busca só encontrou o arquivo de dados, então concluí que o
requisito está cumprido. Mantive como cidade fictícia de teste.

## Suposições

- Estado inicial do simulador: conta de US$ 220 e 80% de cobertura (sugestão do briefing).
- Os perfis só preenchem a conta.
- O quociente é arredondado a 6 casas antes do `ceil`, para evitar erro de ponto flutuante.
- A chamada para ação aponta para `#`.

## Uso de IA
Usei Copilot / Claude Code no VS Code com o servidor MCP do Figma, passando um frame por seção (desktop e mobile). A IA gerou os componentes, a função de cálculo e os primeiros testes. Aproveitei todo o design feito por mim no Figma. Mudei algumas inconsistências visuais (como o espaçamento do simulador no mobile, e adaptação dos ícones de + e - para facilitar a usabilidade no celular. Também ajustei o hover e as rotas dos botões, tanto em desktop quanto em mobile). Conferi o resultado com os 6 cenários do briefing, comparando cada seção com o Figma no desktop e no modo celular, e com a cidade de teste.

## Pendências
- FAQ com números e textos de Phoenix escritos a mão: para outra cidade ficariam errados e deveriam ser gerados pela função de cálculo.
- Sem analytics (não captura UTMs nem registra simulações).
- Sem compartilhamento do resultado por link.

## Links

- Página publicada: https://brightfield-solar-beta.vercel.app/
- Figma: https://www.figma.com/design/TJhyewgzthGsgYvxvVqqrD/Brightfield-Solar?node-id=0-1&t=TY1rCwztReFJfJJb-1
- Vídeo: https://drive.google.com/file/d/1GwNhurA9_SiZTE7Zqa0Iydloajx-ScF5/view?usp=sharing
