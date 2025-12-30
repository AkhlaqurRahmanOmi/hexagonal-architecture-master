export interface TokenServicePort {
  sign(payload: Record<string, any>): Promise<string>;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
