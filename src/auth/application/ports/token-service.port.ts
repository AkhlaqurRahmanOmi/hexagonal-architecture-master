export interface TokenServicePort {
  signAccessToken(payload: Record<string, any>): Promise<string>;
  signRefreshToken(payload: Record<string, any>): Promise<string>;
  verifyAccessToken<T extends object = any>(token: string): Promise<T>;
  verifyRefreshToken<T extends object = any>(token: string): Promise<T>;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
