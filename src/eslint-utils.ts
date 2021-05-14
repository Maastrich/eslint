import { parsemypluginPath } from "./myplugin-path";
import naturalSort from "typescript-natural-sort";
import { Rule } from "eslint";
import { Expression, Node } from "estree";
import { ContextError, report } from "./context-utils";

export function getNodeName(node: any) {
  const { type, name } = node;
  if (type === "Identifier") {
    return name;
  }
  const { id } = node;
  if (id) {
    const { type, name } = id;
    if (type === "Identifier") {
      return name;
    }
  }
};

export function getmypluginPathFromContext(
  context: any
) {
  const filepath = context.getFilename();
  const rootDir = `${context.getCwd()}/`;
  return parsemypluginPath({ filepath, rootDir });
};

function presetIndex(input: string, patterns: RegExp[]): number {
  for (let i = 0; i < patterns.length; ++i) {
    if (patterns[i].test(input)) {
      return i;
    }
  }
  return patterns.length + 1;
}

export function regexSort(list: string[], patterns: RegExp[]) {
  let importGroups: any = {};

  list.forEach((c: string) => {
    importGroups[presetIndex(c, patterns)] = [
      ...(importGroups[presetIndex(c, patterns)] || []),
      c,
    ];
  });

  const importGroupsArr = Object.keys(importGroups).map((groupKey) => {
    let group = importGroups[groupKey];
    return {
      index: groupKey,
      group: group.sort((a: string | number, b: string | number) =>
        //a.localeCompare(b, undefined, { sensitivity: "base" })
        naturalSort(a, b)
      ),
    };
  });
  importGroupsArr.sort((a, b) =>
    a.index < b.index ? -1 : a.index > b.index ? 1 : 0
  );
  const sorted: any[] = [];

  importGroupsArr
    .map((importPath) => importPath.group)
    .forEach((group) => sorted.push(...group));

  return sorted;
};

export function arrayEquals(source: any[], compare: string | any[]) {
  return (
    Array.isArray(source) &&
    Array.isArray(compare) &&
    source.length === compare.length &&
    source.every((val, index) => val === compare[index])
  );
};

export function contextProvider<T extends Node, E extends Node>(cb: (context: Rule.RuleContext, node: T) => void) {
  return ((context: Rule.RuleContext) => (node: T) => {
    try {
      cb(context, node)
    } catch (e) {
      if (e.type === "ContextError") {
        report(context, e as ContextError<E>);
      } else {
        console.error(e.message);
      }
    }
  });
}

export function isJSXText(node: any) {
  // just a nifty utility because parsers don't always agree
  // how to represent text in JSX
  return node.type == "JSXText" || node.type === "Literal";
};

type NodeExpression = Node | Expression | undefined | null;

export function typeIfyNodes<T1 extends NonNullable<NodeExpression>, T2 extends NonNullable<NodeExpression>>(nodes: [NodeExpression, NodeExpression], types: [T1["type"], T2["type"]], cb: (_1: T1, _2: T2) => void) {
  if (nodes[0]?.type === types[0] && nodes[1]?.type === types[1]) {
    cb(nodes[0] as T1, nodes[1] as T2);
  }
}

export function typeIfyNode<T extends NonNullable<NodeExpression>>(node: NodeExpression, type: T["type"], cb: (_: T) => void) {
  if (node?.type === type) {
    cb(node as T);
  }
}