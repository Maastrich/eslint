import { Rule } from "eslint";
import { Node } from "estree";

export class ContextError<T extends Node> extends Error {
  public type: string = "ContextError";

  constructor(public message: string, private node: T, private data: any = {}, private quickFix?: string) {
    super(message);
  }
  getReport(): Rule.ReportDescriptor {
    const { message, data, node } = this;
    return ({
      message,
      node,
      data,
      fix: this.quickFix ? ((fixer: Rule.RuleFixer) => {
        return fixer.replaceText(this.node, this.quickFix!);
      }) : undefined,
    })
  }
}

export function report<T extends Node>(context: Rule.RuleContext, contextError: ContextError<T>) {
  context.report(contextError.getReport());
}