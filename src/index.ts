import { Rule } from "eslint";

import rulesLayout from "./rules/layout";
import rulesNoSCSS from "./rules/no-scss";
import rulesNoLostAssets from "./rules/no-lost-assets";
import rulesImportExport from "./rules/import-export";
import rulesVariables from "./rules/variables";
import rulesMemberExpressions from "./rules/member-expressions";
import rulesHooks from "./rules/hooks";
import rulesReact from "./rules/react";
import rulesLingui from "./rules/lingui";

interface Rules {
  [k: string]: Rule.RuleModule
}

interface Plugin {
  rules: Rules
}

const plugin: Plugin = {
  rules: {
    layout: rulesLayout,
    "import-export": rulesImportExport,
    "no-scss": rulesNoSCSS,
    "no-lost-assets": rulesNoLostAssets,
    variables: rulesVariables,
    "member-expressions": rulesMemberExpressions,
    hooks: rulesHooks,
    react: rulesReact,
    lingui: rulesLingui,
  },
};

console.log(plugin)

export default plugin;