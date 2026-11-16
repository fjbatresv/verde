// Convierte los bloques ```mermaid en <pre class="mermaid">, que Head.astro
// renderiza en el navegador. Así los diagramas del repo se ven igual en GitHub
// y en el sitio.
import { visit } from 'unist-util-visit';

const escapeHtml = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === undefined) return;
      parent.children[index] = {
        type: 'html',
        value: `<pre class="mermaid not-content">${escapeHtml(node.value)}</pre>`,
      };
    });
  };
}
