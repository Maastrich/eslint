import { ContextError } from "../../../context-utils";
import { Rule } from "eslint";
import { CallExpression, Identifier, VariableDeclarator } from "estree";
import { contextProvider, typeIfyNodes, typeIfyNode } from "../../../eslint-utils";
import { isInvalidHandlerName } from "../utils";

function variableDeclarator(_context: Rule.RuleContext, node: VariableDeclarator) {
  typeIfyNodes<Identifier, CallExpression>([node.id, node.init], ["Identifier", "CallExpression"], (id, { callee }) => {
    typeIfyNode<Identifier>(callee, "Identifier", ({ name: calleeName }) => {
      if (calleeName === "useCallback" && isInvalidHandlerName(id.name)) {
        const exprectedName = id.name.replace(/^on/, "handle");
        throw new ContextError(
          `“{{idName}}” would be better written as “yolo”`,
          id,
          { idName: id.name, exprectedName },
          exprectedName
        )
      }
    })
  })
};

export default contextProvider(variableDeclarator);
