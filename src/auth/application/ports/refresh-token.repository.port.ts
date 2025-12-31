export interface RefreshTokenRepositoryPort {
  saveHashedToken(params: {
    tenantId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  findValidTokenHash(tenantId: string, userId: string): Promise<string | null>;
  revoke(tenantId: string, userId: string): Promise<void>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');
