import { Rule } from "eslint";
import callExpression from "./definitions/call-expression";
import variableDeclarator from "./definitions/variable-declarator";

function create(context: Rule.RuleContext): Rule.RuleListener {
  return {
    // CallExpression: callExpression(context),
    // VariableDeclarator: variableDeclarator(context),
  };
};

const hookModule: Rule.RuleModule = {
  create
}

export default hookModule;