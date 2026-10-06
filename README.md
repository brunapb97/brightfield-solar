Leia em português: [README.pt-BR.md](README.pt-BR.md)

# Case 09 — City Page, Brightfield Solar

**Time spent:** approximately 5 hours

A solar energy landing page whose content changes based on the city in the URL (`/phoenix-az`, `/austin-tx`). I implemented each section from the Figma frames (mobile and desktop) as a single responsive component, and all text and numbers that vary by city come from a JSON file.

## How to install and run

Requirements: Node.js 20 or later and npm.

```bash
npm install      # instala as dependências
npm run dev      # servidor de desenvolvimento em http://localhost:3000
npm test         # roda os testes (Vitest)
```

Other useful commands:

```bash
npm run build    # build de produção (gera uma página estática por cidade)
npm run lint     # ESLint
```

The root `/` redirects to `/phoenix-az`.

## Project structure

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

### How to add a new city

1. Create `data/cities/<slug>.json`, for example `data/cities/denver-co.json`, using the same format as the existing files (see the `City` type in `lib/types.ts`). The `slug` field must match the file name.
2. That's it: `getAllCitySlugs()` reads the folder, so the `/denver-co` route will be available on the next `npm run dev` or `npm run build`, with its own title and description. No code changes are needed.

A slug without a file returns 404.

## Technical decisions

- **Next.js (App Router) with static pages.** `generateStaticParams` generates one page per file in `data/cities`. The data is read on the server, so no city-specific data goes into the client bundle.
- **Data kept outside the code.** Components receive `city: City` through typed props and contain no hardcoded city-specific text. The simulator numbers (rate, sunshine hours, cost per watt, panel minimum, federal credit) come from the JSON.
- **Mobile first.** The base style follows the mobile frame, and the `lg:` prefix applies desktop styles without duplicating content in hidden versions. Since Figma has only two frames, I used `lg:` (1024 px) instead of `md:`, because three-column grids feel cramped at 768 px.
- **Tailwind 4 with tokens.** Colors, text sizes, and fonts are defined in `globals.css`.
- **Calculation isolated and tested.** `lib/calculate.ts` is a pure function, covered by tests in `lib/calculate.test.ts`.
- **Accessibility.** Semantic HTML (`section`, heading hierarchy, `nav`, `footer`), `alt` text for images, visible focus, FAQ as an accordion with `aria-expanded`, and a mobile menu with `aria-expanded` that closes with Esc.

## Two decisions I made

### 1. Not relying only on AI-generated tests
I asked the agent for the calculation function and tests. The 4 tests it wrote passed,
but they checked behaviors (minimum, cap, rounding, invalid inputs) rather than
the numbers in the brief. Since the code and tests came from the same source, I wanted an
independent check. I added the 6 scenarios from the example table, with expected panels,
investment, savings, and payback. All scenarios passed, independently confirming that the function follows the rules in the brief, including the panel minimum and the savings cap. I also realized that tests written by the same source as the code tend to validate the logic itself, so I used external values.

### 2. Testing the requirement "change the file, change the city"
I wanted to confirm that adding a new city only requires a new file. I copied `phoenix-az.json`
to `austin-tx.json`, changed the city, rate, sunshine hours, panel minimum, phone number, and
team names, and opened `/austin-tx`. I also searched for "Phoenix" in the components. The page
changed completely, and the search found only the data file, so I concluded that the
requirement is met. I kept it as a fictional test city.

## Assumptions

- Initial simulator state: a US$ 220 bill and 80% coverage (suggested in the brief).
- The profiles only fill in the bill amount.
- The quotient is rounded to 6 decimal places before `ceil` to avoid floating-point errors.
- The call to action points to `#`.

## AI use
I used Copilot / Claude Code in VS Code with the Figma MCP server, providing one frame per section (desktop and mobile). The AI generated the components, calculation function, and initial tests. I used all the design work I had created in Figma. I fixed some visual inconsistencies (such as the simulator spacing on mobile and adapting the + and - icons to make them easier to use on a phone). I also adjusted the hover state and button routes on both desktop and mobile. I checked the result against the 6 scenarios in the brief, comparing each section with Figma on desktop and mobile, and with the test city.

## Outstanding items
- FAQ with Phoenix-specific numbers and text written by hand: these would be incorrect for another city and should be generated by the calculation function.
- No analytics (UTMs are not captured and simulations are not recorded).
- No way to share the result via a link.

## Links

- Published page: https://brightfield-solar-beta.vercel.app/
- Figma: https://www.figma.com/design/TJhyewgzthGsgYvxvVqqrD/Brightfield-Solar?node-id=0-1&t=TY1rCwztReFJfJJb-1
- Video: https://drive.google.com/file/d/1GwNhurA9_SiZTE7Zqa0Iydloajx-ScF5/view?usp=sharing
