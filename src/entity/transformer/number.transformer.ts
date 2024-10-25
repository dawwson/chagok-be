export class NumberTransformer {
  // entity -> DB value
  to(data: number) {
    return data;
  }

  // DB value -> entity
  from(data: string) {
    return parseInt(data);
  }
}
