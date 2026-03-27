@ts-ignore
const value: number = "This should be a number";

export function addOne(x: number) {
  @ts-ignore
  return x + value;
}
