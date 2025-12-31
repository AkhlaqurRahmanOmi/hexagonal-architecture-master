# CRM MVP Build Plan

## Foundations
- [x] Multi-tenant core (Tenant, Membership, RBAC, Auth)
- [ ] Tenant domain mapping (`tenant_domains`)

## Module 1: Leads
- [ ] Lead domain (Lead aggregate + value objects)
- [ ] Lead ports + CQRS (create/update/convert/list)
- [ ] Lead TypeORM entities + repo adapters
- [ ] Lead controller + DTOs

## Module 2: Activity Timeline
- [ ] Activity domain (generic timeline entry)
- [ ] Activity ports + CQRS (log, list by entity)
- [ ] Activity TypeORM entities + repo adapters
- [ ] Activity controller + DTOs

## Module 3: Inbound Capture
- [ ] InboundLead domain + DTOs
- [ ] InboundLead TypeORM entity + repo adapter
- [ ] Public endpoint: resolve tenant by domain → store inbound → create lead → log activity

## Module 4: Accounts & Contacts (MVP-light)
- [ ] Account domain + CQRS + controller
- [ ] Contact domain + CQRS + controller
- [ ] Link contact/account to leads and activities

## Module 5: Deals (MVP-light)
- [ ] Deal domain + CQRS + controller
- [ ] Pipeline stage tracking (minimal)

## Cross-cutting
- [ ] RBAC guard integration on internal endpoints
- [ ] Tenant guard on tenant-scoped endpoints
- [ ] Basic indexes & constraints for tenant isolation
- [ ] Seed default permissions/roles (admin, member)

