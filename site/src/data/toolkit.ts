// Herramientas y agentes recomendados (ver guias/herramientas.md).
// Si existe site/public/logos/<id>.svg (el logo oficial, del press kit de la
// marca), la portada lo muestra con su texto alternativo; si no, un monograma.

export type Lang = 'es' | 'en';

export interface Tool {
  id: string;
  name: string;
  monogram: string;
  url: string;
  role: Record<Lang, string>;
}

export interface Lane {
  id: string;
  title: Record<Lang, string>;
  who: Record<Lang, string>;
  tools: Tool[];
}

export const lanes: Lane[] = [
  {
    id: 'orquestar',
    title: { es: 'Orquestar', en: 'Orchestrate' },
    who: { es: 'operador', en: 'operator' },
    tools: [
      { id: 'orca', name: 'Orca', monogram: 'Or', url: 'https://orca.dev', role: { es: 'Una worktree por agente', en: 'One worktree per agent' } },
      { id: 'obsidian', name: 'Obsidian', monogram: 'Ob', url: 'https://obsidian.md', role: { es: 'El vault', en: 'The vault' } },
    ],
  },
  {
    id: 'disenar',
    title: { es: 'Diseñar', en: 'Design' },
    who: { es: 'PM · PO aprueba', en: 'PM · PO approves' },
    tools: [
      { id: 'stitch', name: 'Stitch', monogram: 'St', url: 'https://stitch.withgoogle.com', role: { es: 'Pantallas antes del código', en: 'Screens before code' } },
      { id: 'kiro', name: 'Kiro', monogram: 'Ki', url: 'https://kiro.dev', role: { es: 'Arquitectura y specs', en: 'Architecture and specs' } },
    ],
  },
  {
    id: 'dirigir',
    title: { es: 'Dirigir y revisar', en: 'Lead and review' },
    who: { es: 'PM · revisor', en: 'PM · reviewer' },
    tools: [
      { id: 'claude-code', name: 'Claude Code', monogram: 'Cc', url: 'https://claude.com/product/claude-code', role: { es: 'PM y revisor', en: 'PM and reviewer' } },
      { id: 'codex', name: 'Codex', monogram: 'Cx', url: 'https://openai.com/codex', role: { es: 'PM, revisor o dev', en: 'PM, reviewer or dev' } },
      { id: 'coderabbit', name: 'CodeRabbit', monogram: 'Cr', url: 'https://www.coderabbit.ai', role: { es: 'Segunda mirada al diff', en: 'Second look at the diff' } },
    ],
  },
  {
    id: 'implementar',
    title: { es: 'Implementar', en: 'Build' },
    who: { es: 'dev · persona o agente', en: 'dev · person or agent' },
    tools: [
      { id: 'cursor', name: 'Cursor', monogram: 'Cu', url: 'https://cursor.com', role: { es: 'Encargos chicos', en: 'Small briefs' } },
      { id: 'gemini-cli', name: 'Gemini CLI', monogram: 'Ge', url: 'https://github.com/google-gemini/gemini-cli', role: { es: 'Encargos chicos', en: 'Small briefs' } },
      { id: 'opencode', name: 'opencode', monogram: 'oc', url: 'https://opencode.ai', role: { es: 'Modelos locales', en: 'Local models' } },
    ],
  },
  {
    id: 'puerta',
    title: { es: 'La puerta', en: 'The gate' },
    who: { es: 'dev · PM integra', en: 'dev · PM merges' },
    tools: [
      { id: 'github-actions', name: 'GitHub Actions', monogram: 'GA', url: 'https://github.com/features/actions', role: { es: 'CI espejo', en: 'Mirror CI' } },
      { id: 'playwright', name: 'Playwright', monogram: 'Pw', url: 'https://playwright.dev', role: { es: 'e2e y revisión en vivo', en: 'e2e and live review' } },
      { id: 'axe', name: 'axe', monogram: 'ax', url: 'https://github.com/dequelabs/axe-core', role: { es: 'Accesibilidad', en: 'Accessibility' } },
      { id: 'snyk', name: 'Snyk', monogram: 'Sn', url: 'https://snyk.io', role: { es: 'Vulnerabilidades', en: 'Vulnerabilities' } },
      { id: 'dependabot', name: 'Dependabot', monogram: 'Db', url: 'https://docs.github.com/code-security/dependabot', role: { es: 'Dependencias al día', en: 'Dependencies up to date' } },
      { id: 'sonarqube', name: 'SonarQube Server', monogram: 'Sq', url: 'https://www.sonarsource.com/products/sonarqube/', role: { es: 'Calidad, en tu servidor', en: 'Quality, self-hosted' } },
      { id: 'sonarcloud', name: 'SonarQube Cloud', monogram: 'SC', url: 'https://www.sonarsource.com/products/sonarqube/cloud/', role: { es: 'Calidad como servicio', en: 'Quality as a service' } },
    ],
  },
  {
    id: 'observar',
    title: { es: 'Observar', en: 'Observe' },
    who: { es: 'después del merge', en: 'after the merge' },
    tools: [
      { id: 'sentry', name: 'Sentry', monogram: 'Se', url: 'https://sentry.io', role: { es: 'Errores → causa raíz', en: 'Errors → root cause' } },
    ],
  },
];

export const allTools = lanes.flatMap((lane) => lane.tools);
