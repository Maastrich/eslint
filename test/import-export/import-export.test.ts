import { RuleTester } from "eslint";

import rules from "../../src/rules/import-export";
import exportNameConsistency from "./__fixtures__/export-names-consistency";
import importNameConsistency from "./__fixtures__/import-names-consistency";
import importOrderCompliancy from "./__fixtures__/import-order-compliancy";
import noAbsolutePathImports from "./__fixtures__/no-absolute-path-imports";

const ruleTester = new RuleTester();

ruleTester.run("Import name consistency", rules, importNameConsistency);

ruleTester.run("Export name consistency", rules, exportNameConsistency);

ruleTester.run("Import order compliancy", rules, importOrderCompliancy);

ruleTester.run("No absolute path imports", rules, noAbsolutePathImports);
