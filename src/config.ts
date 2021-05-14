import fs from "fs";
import YAML from "yaml";

export class Config {
  private validHooksInUiComponents: { [k: string]: boolean } = {
    useMemo: true,
    useCallback: true,
    useRef: true
  }
  isValidHookName(hook: string) {
    return this.validHooksInUiComponents[hook] ?? false;
  }
  constructor(yaml?: any) {
    if (yaml) {
      yaml["valid-hooks-in-ui-components"]?.forEach((hook: string | { [k: string]: boolean }) => {
        if (typeof hook === "string") { this.validHooksInUiComponents[hook] = true; }
        else {
          Object.keys(hook).forEach((key) => {
            this.validHooksInUiComponents[key] = hook[key];
          })
        }
      });
    }
  }
}

export function getConfig(): Config {
  try {
    const data = fs.readFileSync(".eslint.myplugin.yml", {
      encoding: "utf-8",
    });
    const config = new Config(YAML.parse(data, { keepNodeTypes: true }));
    return config;
  } catch (e) {
    return new Config();
  }
};
