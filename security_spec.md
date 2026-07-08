# Security Specification & "Dirty Dozen" Threat Model

This document defines the security boundaries, invariant rules, and the "Dirty Dozen" malicious payload tests designed to audit the system's defenses against identity spoofing, state shortcuts, and database resource poisoning.

## 1. Data Invariants

1. **User Identity Isolation**: A user can only access or modify their own user document under `/users/{userId}`. They cannot view or modify other users' files.
2. **Authenticated Asset Management**: Assets can only be created, read, updated, or deleted by authenticated, active users.
3. **Asset Registration Integrity**: During asset creation, `createdBy` must match the authenticated user's ID/email, and `createdAt` and `updatedAt` must be set strictly to the server time (`request.time`).
4. **Code and Text Length Bounds**: Asset codes and names must be strictly validated for length (e.g., `assetCode` ≤ 64 chars, `assetName` ≤ 128 chars) to prevent "Denial of Wallet" resource exhaustion or SQL-like injection payloads in the database.
5. **No State Shortcutting**: Asset updates are only permitted on specific fields and must validate that the document structural format is preserved.
6. **Immutable Fields**: The fields `assetCode`, `createdBy`, and `createdAt` are immutable after the asset document is created.
7. **Verified Users Only**: Standard writes are only permitted if the user has a valid, active authentication session.

---

## 2. The "Dirty Dozen" Payloads

These 12 malicious payloads represent attempts to break system security and must be rejected with `PERMISSION_DENIED` by the Firestore security rules.

### Test 1: Identity Spoofing - Impersonate Another User's Profile
An attacker (`auth.uid = "attacker_uid"`) attempts to create or write to `/users/victim_uid`.
- **Target Path**: `/users/victim_uid`
- **Result**: `PERMISSION_DENIED` (Rule: `request.auth.uid == userId`)

### Test 2: Unauthenticated Asset Registration
An anonymous or unauthenticated guest tries to register an asset.
- **Target Path**: `/assets/some_new_asset`
- **Payload**:
  ```json
  {
    "assetCode": "AST-0001",
    "assetName": "Stolen Server Laptop",
    "category": "IT Equipment",
    "brand": "MalwareBox",
    "model": "X",
    "serialNumber": "SN-666",
    "purchaseDate": "2026-07-08",
    "purchaseCost": 9999.00,
    "department": "IT",
    "location": "Remote",
    "status": "Active"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `request.auth != null`)

### Test 3: Owner Hijacking - Forge `createdBy` on Creation
An attacker (`auth.uid = "attacker_uid"`) registers an asset but sets `createdBy` to `"admin_uid"` to elevate ownership status or hide their trail.
- **Target Path**: `/assets/asset_1`
- **Payload**:
  ```json
  {
    "assetCode": "AST-1002",
    "assetName": "Forged Owner Laptop",
    "createdBy": "admin_uid",
    "createdAt": "2026-07-08T00:00:00Z"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().createdBy == request.auth.uid` or `request.auth.token.email`)

### Test 4: Resource Poisoning - Giant String Injection (Denial of Wallet)
An attacker attempts to inject a huge 2MB string into `assetName` to exhaust Firestore storage and project budget.
- **Target Path**: `/assets/asset_huge`
- **Payload**:
  ```json
  {
    "assetCode": "AST-HUGE",
    "assetName": "A...[Repeated 500,000 times]...A",
    "category": "IT Equipment"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().assetName.size() <= 128`)

### Test 5: Mutate Immutable Field - Change `assetCode` on Update
An attacker tries to edit an existing asset to modify its unique `assetCode`, which would break barcode alignment and indexing.
- **Target Path**: `/assets/asset_1`
- **Payload**:
  ```json
  {
    "assetCode": "MODIFIED-CODE-888"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().assetCode == existing().assetCode`)

### Test 6: Hijack Sibling Record - Update `createdBy` to Steal Asset
An attacker tries to overwrite `createdBy` of someone else's asset to claim it as theirs.
- **Target Path**: `/assets/asset_other_user`
- **Payload**:
  ```json
  {
    "createdBy": "attacker_uid"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().createdBy == existing().createdBy`)

### Test 7: Bypass Timestamp Controls - Inject Fake Future `createdAt`
An attacker sends a future date-time string as `createdAt` rather than using the server's authoritative timestamp.
- **Target Path**: `/assets/asset_timestamp`
- **Payload**:
  ```json
  {
    "assetCode": "AST-TS",
    "createdAt": "2050-12-31T23:59:59Z"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().createdAt == request.time`)

### Test 8: Type Pollution - Send Boolean for Purchase Cost
An attacker attempts to corrupt the accounting system by passing `purchaseCost: "nine thousand dollars"` or `purchaseCost: true` instead of a float/number.
- **Target Path**: `/assets/asset_type`
- **Payload**:
  ```json
  {
    "purchaseCost": true
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().purchaseCost is number`)

### Test 9: State Shortcutting - Override Strict Enumeration on Status
An attacker attempts to set an invalid state value in the lifecycle status, bypassing the options "Active", "Maintenance", "Retired".
- **Target Path**: `/assets/asset_state`
- **Payload**:
  ```json
  {
    "status": "DestroyedByFire"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().status in ['Active', 'Maintenance', 'Retired']`)

### Test 10: Unauthorized Blanket Querying (Scraping)
An attacker executes a query without filters, trying to read all assets in the database without any authorization check on individual rows.
- **Target Path**: `/assets` (List query)
- **Result**: `PERMISSION_DENIED` unless properly authorized and filtered (Rule: `allow list: if isSignedIn()`)

### Test 11: Foreign Primary Reference - Orphaned Reference Creation
An attacker registers an asset referencing a non-existent parent department or category, trying to orphan indices.
- **Target Path**: `/assets/asset_orphan`
- **Result**: `PERMISSION_DENIED` (Enforced by strict local validators)

### Test 12: Corrupt Audit Trails - Evade `updatedAt` update
An attacker updates an asset but forces the payload to not change `updatedAt`, or sets a faked past `updatedAt`, bypassing timestamp-based sync logs.
- **Target Path**: `/assets/asset_1`
- **Payload**:
  ```json
  {
    "assetName": "New Name",
    "updatedAt": "2010-01-01T00:00:00Z"
  }
  ```
- **Result**: `PERMISSION_DENIED` (Rule: `incoming().updatedAt == request.time`)

---

## 3. Threat Matrix & Validation Rules

| Attack Vector | Vulnerability Class | Mitigation Rule |
|---|---|---|
| **Identity Spoofing** | User profiles | `request.auth.uid == userId` |
| **State Shortcutting**| Status updates | `incoming().status in ['Active', 'Maintenance', 'Retired']` |
| **Resource Poisoning**| Storage Exhaustion | `incoming().assetName.size() <= 128` and `.size() <= 64` checks on string fields |
| **Tampering** | Immutable fields | `incoming().assetCode == existing().assetCode` & `incoming().createdBy == existing().createdBy` |
| **Falsification** | Clock drift / fake time | `incoming().createdAt == request.time` & `incoming().updatedAt == request.time` |
