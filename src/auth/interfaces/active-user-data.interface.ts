export interface ActiveUserData {
  sub: string;
  tenantId: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}
