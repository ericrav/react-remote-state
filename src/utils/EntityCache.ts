export class EntityCache {
  private cache: Record<string, any> = {};

  public get(key: string) {
    return this.cache[key];
  }

  public set(key: string, value: any) {
    this.cache[key] = {
      value,
      timestamp: Date.now(),
    };
  }
}
