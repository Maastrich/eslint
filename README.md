# eslint-plugin-myplugin

[![NPM](https://github.com/myplugin-devops/eslint-plugin-myplugin/actions/workflows/npm.yml/badge.svg)](https://github.com/myplugin-devops/eslint-plugin-myplugin/actions/workflows/npm.yml)

This Eslint plugin enables myplugin specific rules regarding the names of the
files and the components used in the React repositories.

## Install

To install this plugin, add it as a dev dependency:

```bash
npm install --save-dev @myplugin-devops/eslint-plugin-myplugin
```

Then enable the plugin, and activate the rules you want to enforce (you can
find a list of allowed rules in the [sample/rules.json](sample/rules.json)
file. configuration):

```yml
"plugins": ["@myplugin-devops/myplugin"],
"rules": {
  // see sample/rules.json for contents
}
```

## Configuration

### Allowed hooks in UI components

By default, only the following hooks are allowed in UI components:

- `useMemo()`
- `useCallback()`
- `useRef()`

You can whitelist some hooks to be allowed by creating a file named
`.eslint.myplugin.yml` at the root of your project. The file
[dot-eslint-myplugin.yml](sample/dot-eslint.myplugin.yml) can be used as a
good starting point.
