import { Rule } from "eslint";
import { CallExpression, Identifier } from "estree";
import { contextProvider, typeIfyNode } from "../../../eslint-utils";
import { getmypluginPathFromContext } from "../../../eslint-utils";
import { isHookName } from "../utils";
import { getConfig } from "../../../config";
import { ContextError } from "../../../context-utils";

function callExpression(context: Rule.RuleContext, node: CallExpression) {
  console.log('callExpression')
  const { filename, localDirname } = getmypluginPathFromContext(context);
  typeIfyNode<Identifier>(node.callee, "Identifier", ({ name }) => {
    if (
      isHookName(name) &&
      localDirname.match(/src\/components\//) &&
      !getConfig().isValidHookName(name) &&
      !filename.match(/Base$/)
    ) {
      const expectedLocation = `${localDirname.split("/").slice(-2, -1)[0]}Base`
      throw new ContextError(
        `You cannnot call {{name}} in UI components, consider moving the hook into “{{expectedLocation}}`,
        node.callee,
        { name, expectedLocation },
      )
    }
  });
};

export default contextProvider(callExpression);