export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export function formatOrderNumber(id: string): string {
  return `#${id}`;
}
