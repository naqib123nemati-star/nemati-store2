export const WHATSAPP_NUMBER = "0788809892";
export const WHATSAPP_LINK = "https://wa.me/message/OXJD732C6REGM1";

export type WhatsappOrderItem = {
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
};

export function buildWhatsappMessage(items: WhatsappOrderItem[], t: any) {
  const lines = [t.whatsappMessage.greeting, ""];

  for (const item of items) {
    lines.push(`${t.whatsappMessage.name}: ${item.name}`);
    lines.push(`${t.whatsappMessage.price}: ${item.price.toLocaleString()} افغانی`);
    lines.push(`${t.whatsappMessage.qty}: ${item.quantity}`);
    if (item.color) lines.push(`${t.whatsappMessage.color}: ${item.color}`);
    if (item.size) lines.push(`${t.whatsappMessage.size}: ${item.size}`);
    lines.push("");
  }

  lines.push(t.whatsappMessage.confirm);
  return lines.join("\n");
}

export function buildWhatsappUrl(items: WhatsappOrderItem[], t: any) {
  const message = buildWhatsappMessage(items, t);
  return `https://wa.me/93${WHATSAPP_NUMBER.replace(/^0/, "")}?text=${encodeURIComponent(message)}`;
}
