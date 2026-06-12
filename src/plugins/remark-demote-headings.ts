import { visit } from 'unist-util-visit';

/**
 * Demote every in-content Markdown heading by one level so the page <h1>
 * supplied by the layout (the post title) is the sole <h1> on the page.
 *
 * Many posts — especially the newsletter issues — use `#` as in-issue section
 * headers (Reading / Writing / Watching …), which would otherwise render as
 * additional <h1> elements competing with the post title. Shifting `#`→<h2>,
 * `##`→<h3>, etc. restores a single-h1 hierarchy. Depth is capped at 6.
 */
export default function remarkDemoteHeadings() {
  return (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      node.depth = Math.min(node.depth + 1, 6);
    });
  };
}
