import { RuleTester } from "eslint";

import rules from "../../src/rules/hooks"
import noHooksInUI from "./__fixtures__/no-hooks-in-ui";

const ruleTester = new RuleTester();

ruleTester.run("No hooks in UI components", rules, noHooksInUI);
