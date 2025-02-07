import { Inject, Injectable } from "@nestjs/common";
import { CacheManager } from "../interfaces/cache-manager.interface";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CacheManagerAdapter implements CacheManager {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ){}

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ?  ttl  : undefined);
  }
  async get<T>(key: string): Promise<T | null> {
    return (await this.cacheManager.get<T>(key) || null); 
  }

}