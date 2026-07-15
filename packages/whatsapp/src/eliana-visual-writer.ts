export interface WhatsAppVisualMessage {
  title?: string;
  body: string;
  footer?: string;
  actions?: Array<{ id: string; label: string }>;
}

export class ElianaVisualWriter {
  bold(value: string): string { return `*${value}*`; }
  italic(value: string): string { return `_${value}_`; }
  strike(value: string): string { return `~${value}~`; }
  code(value: string): string { return `\`\`\`${value}\`\`\``; }

  compose(message: WhatsAppVisualMessage): string {
    const sections: string[] = [];
    if (message.title) sections.push(this.bold(message.title));
    sections.push(message.body);
    if (message.footer) sections.push(this.italic(message.footer));
    if (message.actions?.length) {
      sections.push(
        message.actions.map((action, index) => `${index + 1}. ${action.label}`).join("\n")
      );
    }
    return sections.join("\n\n");
  }
}
