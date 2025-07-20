// all written by ai
const { Project, Node } = require("ts-morph");
const MagicString = require("magic-string");
const path = require("path");

const project = new Project({ useInMemoryFileSystem: true });

module.exports = function designModeLoader(src, map) {
  const done = this.async();
  try {
    const sf =
      project.getSourceFile(this.resourcePath) ??
      project.createSourceFile(this.resourcePath, src, { overwrite: true });
    sf.replaceWithText(src);

    const relativePath = path.relative(process.cwd(), this.resourcePath);

    const ms = new MagicString(src);

    sf.forEachDescendant((node) => {
      if (
        Node.isJsxOpeningElement(node) ||
        Node.isJsxSelfClosingElement(node)
      ) {
        const hasAttribute = node.getAttributes().some((attr) => {
          return (
            Node.isJsxAttribute(attr) &&
            attr.getNameNode().getText() === "__v0_c"
          );
        });

        if (!hasAttribute) {
          const { line, column } = sf.getLineAndColumnAtPos(node.getStart());

          let insertPos;
          if (Node.isJsxSelfClosingElement(node)) {
            insertPos = node.getEnd() - 2;
          } else {
            insertPos = node.getEnd() - 1;
          }

          ms.appendLeft(
            insertPos,
            ` __v0_c="${relativePath}:${line}:${column}"`
          );
        }
      }
    });

    done(
      null,
      ms.toString(),
      ms.generateMap({ source: this.resourcePath, hires: true })
    );
  } catch (e) {
    done(e);
  }
};
