# Mobile Barcode Price Checker — Software Requirements

## 1. Project Overview

ระบบ Mobile Barcode Price Checker เป็นระบบสำหรับให้ผู้ใช้งานใช้โทรศัพท์มือถือสแกน Barcode ของสินค้า แล้วระบบค้นหาข้อมูลสินค้าจาก Backend และแสดงราคาปัจจุบันบนหน้าจอมือถือ

ระบบประกอบด้วย:

- Mobile Web สำหรับสแกน Barcode และแสดงข้อมูลสินค้า
- Backend API สำหรับค้นหาข้อมูลสินค้าและราคา
- Database สำหรับเก็บสินค้า ราคา และประวัติราคา
- Admin สำหรับจัดการสินค้าและราคา

---

## 2. Objectives

1. ให้ผู้ใช้สามารถตรวจสอบราคาสินค้าได้อย่างรวดเร็ว
2. ลดความผิดพลาดจากการกรอกรหัสสินค้าเอง
3. รองรับการสแกน Barcode ด้วยกล้องโทรศัพท์
4. แสดงราคาปัจจุบันจากข้อมูลกลางของระบบ
5. รองรับการจัดการสินค้าและราคาโดย Admin
6. สามารถเก็บประวัติการเปลี่ยนแปลงราคาได้

---

## 3. Scope

### 3.1 In Scope

- สแกน Barcode ด้วยกล้องมือถือ
- กรอก Barcode ด้วยตัวเอง
- ค้นหาสินค้าจาก Barcode
- แสดงชื่อสินค้า
- แสดงรูปสินค้า
- แสดง Barcode
- แสดงราคาปัจจุบัน
- แสดงหน่วยสินค้า
- แสดงสถานะสินค้า
- จัดการสินค้าโดย Admin
- จัดการราคาสินค้าโดย Admin
- เก็บประวัติราคา
- รองรับการสแกนสินค้าต่อเนื่อง

### 3.2 Out of Scope สำหรับ MVP

- ระบบชำระเงิน
- ระบบตะกร้าสินค้า
- ระบบสั่งซื้อ
- ระบบสมาชิก Customer
- ระบบ Loyalty
- ระบบ POS เต็มรูปแบบ
- ระบบ Stock Management แบบเต็มรูปแบบ

---

# 4. User Roles

## 4.1 Customer / User

สามารถ:

- เปิดหน้า Scan
- เปิดกล้อง
- สแกน Barcode
- กรอก Barcode เอง
- ดูข้อมูลสินค้า
- ดูราคาปัจจุบัน
- สแกนสินค้ารายการถัดไป

## 4.2 Admin

สามารถ:

- เพิ่มสินค้า
- แก้ไขสินค้า
- เปิด/ปิดสินค้า
- กำหนดราคา
- เปลี่ยนราคา
- ดูประวัติราคา
- ค้นหาสินค้า
- จัดการข้อมูลสินค้า

---

# 5. Functional Requirements

## FR-001 เปิดหน้า Scan

ระบบต้องสามารถแสดงหน้า Scan Barcode เมื่อผู้ใช้เปิดระบบ

หน้า Scan ต้องมี:

- ปุ่มเปิดกล้อง / Scan
- ช่องกรอก Barcode
- ปุ่มค้นหา
- พื้นที่แสดงข้อความ Error
- พื้นที่แสดงผลการค้นหา

---

## FR-002 Scan Barcode

ระบบต้องสามารถใช้กล้องของโทรศัพท์เพื่ออ่าน Barcode

### Flow

1. User กดปุ่ม Scan
2. Browser ขอ Permission ในการใช้ Camera
3. User อนุญาตการใช้งาน Camera
4. ระบบเปิด Camera
5. User นำ Barcode เข้าไปในกรอบ Scan
6. ระบบอ่าน Barcode
7. ระบบส่ง Barcode ไปยัง Backend
8. Backend ค้นหาข้อมูลสินค้า
9. ระบบแสดงข้อมูลสินค้า

---

## FR-003 Camera Permission

กรณี User ไม่อนุญาต Camera:

ระบบต้องแสดงข้อความ เช่น:

> ไม่สามารถใช้งานกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง หรือกรอก Barcode ด้วยตัวเอง

ระบบต้องยังสามารถใช้งานด้วย Manual Barcode Input ได้

---

## FR-004 Manual Barcode Input

User สามารถกรอก Barcode ด้วยตัวเองได้

ตัวอย่าง:

```text
Barcode: 8851959131048

[ค้นหา]
```

เมื่อกดค้นหา ระบบต้องส่ง Barcode ไปยัง Backend

---

## FR-005 Search Product

Backend ต้องสามารถค้นหาสินค้าจาก Barcode

API:

```http
GET /api/products/barcode/{barcode}
```

ตัวอย่าง:

```http
GET /api/products/barcode/8851959131048
```

---

## FR-006 Product Found

กรณีพบสินค้า ระบบต้องแสดง:

- Product Name
- Product Image
- Barcode
- Current Price
- Unit
- Product Status

ตัวอย่าง:

```text
น้ำดื่ม Crystal 600ml

Barcode
8851959131048

ราคา

฿15.00 / ขวด

สถานะ
มีสินค้า
```

---

## FR-007 Product Not Found

กรณีไม่พบ Barcode:

ระบบต้องแสดงข้อความ:

> ไม่พบสินค้าที่ตรงกับ Barcode นี้

และต้องมีปุ่ม:

```text
[สแกนใหม่]
```

หรือ

```text
[กรอก Barcode ใหม่]
```

---

## FR-008 Display Current Price

ระบบต้องแสดงราคาปัจจุบันของสินค้า

ราคาต้องมาจาก Backend ไม่ใช่ค่าที่เก็บไว้ใน Mobile Browser

ตัวอย่าง:

```text
ราคาขาย

฿15.00
```

---

## FR-009 Scan Next Product

หลังจากแสดงข้อมูลสินค้าแล้ว User สามารถกด:

```text
[สแกนสินค้าใหม่]
```

เพื่อกลับไปยังหน้า Scan

---

# 6. Admin Requirements

## FR-010 Create Product

Admin สามารถเพิ่มสินค้าใหม่ได้

ข้อมูลขั้นต่ำ:

- Barcode
- Product Name
- Unit
- Image
- Status
- Initial Price

---

## FR-011 Update Product

Admin สามารถแก้ไขข้อมูลสินค้าได้

สามารถแก้ไข:

- Product Name
- Unit
- Image
- Status

Barcode ควรมี Validation และไม่ควรซ้ำกับสินค้าอื่น

---

## FR-012 Update Price

Admin สามารถเปลี่ยนราคาสินค้าได้

เมื่อเปลี่ยนราคา:

1. ระบบบันทึกราคาใหม่
2. ปิดสถานะราคาปัจจุบันเดิม
3. สร้าง Price History
4. ราคาใหม่กลายเป็น Current Price

ตัวอย่าง:

```text
เดิม
฿12.00

เปลี่ยนเป็น
฿15.00
```

ระบบต้องสามารถตรวจสอบย้อนหลังได้ว่า:

```text
01/01/2026    ฿12.00
01/03/2026    ฿13.00
01/06/2026    ฿15.00
```

---

# 7. Database Requirements

## 7.1 products

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary Key |
| barcode | VARCHAR | Barcode ของสินค้า |
| name | VARCHAR | ชื่อสินค้า |
| unit | VARCHAR | หน่วย |
| image_url | VARCHAR | URL รูปสินค้า |
| status | BOOLEAN | สถานะสินค้า |
| created_at | DATETIME | วันที่สร้าง |
| updated_at | DATETIME | วันที่แก้ไข |

Constraint:

```text
barcode UNIQUE
```

---

## 7.2 product_prices

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary Key |
| product_id | BIGINT | FK products |
| price | DECIMAL | ราคาสินค้า |
| effective_from | DATETIME | วันที่เริ่มใช้ |
| effective_to | DATETIME | วันที่สิ้นสุด |
| created_at | DATETIME | วันที่สร้าง |

---

## 7.3 Relationships

```text
products
   │
   │ 1
   │
   │ N
   ▼
product_prices
```

สินค้า 1 รายการสามารถมีประวัติราคาได้หลายรายการ

---

# 8. API Requirements

## 8.1 Get Product By Barcode

```http
GET /api/products/barcode/{barcode}
```

Response:

```json
{
  "id": 1,
  "barcode": "8851959131048",
  "name": "น้ำดื่ม Crystal 600ml",
  "price": 15.00,
  "unit": "ขวด",
  "imageUrl": "/images/crystal.jpg",
  "status": true
}
```

---

## 8.2 Create Product

```http
POST /api/products
```

Request:

```json
{
  "barcode": "8851959131048",
  "name": "น้ำดื่ม Crystal 600ml",
  "unit": "ขวด",
  "imageUrl": "/images/crystal.jpg"
}
```

---

## 8.3 Update Product

```http
PUT /api/products/{id}
```

---

## 8.4 Update Product Price

```http
POST /api/products/{id}/prices
```

Request:

```json
{
  "price": 15.00
}
```

---

## 8.5 Get Price History

```http
GET /api/products/{id}/prices
```

Response:

```json
[
  {
    "price": 12.00,
    "effectiveFrom": "2026-01-01T00:00:00"
  },
  {
    "price": 13.00,
    "effectiveFrom": "2026-03-01T00:00:00"
  },
  {
    "price": 15.00,
    "effectiveFrom": "2026-06-01T00:00:00"
  }
]
```

---

# 9. Error Handling

ระบบต้องรองรับกรณีต่อไปนี้:

### Barcode ไม่พบ

```text
404 PRODUCT_NOT_FOUND
```

ข้อความ:

```text
ไม่พบสินค้าที่ตรงกับ Barcode นี้
```

### Barcode ไม่ถูกต้อง

```text
400 INVALID_BARCODE
```

### Server Error

```text
500 INTERNAL_SERVER_ERROR
```

ข้อความ:

```text
เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง
```

### Camera Permission Denied

ระบบต้องอนุญาตให้ User เปลี่ยนไปใช้ Manual Input

---

# 10. UI Requirements

## 10.1 Scan Page

ต้องออกแบบให้เหมาะกับ Mobile First

องค์ประกอบ:

```text
Header
   │
   ├── Title
   │
   ▼
Scanner Area
   │
   ▼
Manual Barcode Input
   │
   ▼
Search Button
```

---

## 10.2 Product Result Page

ข้อมูลที่สำคัญที่สุดต้องอยู่ด้านบน

ลำดับที่แนะนำ:

1. Product Image
2. Product Name
3. Price
4. Unit
5. Barcode
6. Product Status
7. Scan Again Button

ราคาควรมีขนาดใหญ่และอ่านง่าย

---

# 11. Non-Functional Requirements

## NFR-001 Performance

หลังจากสแกน Barcode แล้ว ระบบควรแสดงผลภายใน:

```text
Target: < 2 seconds
```

ภายใต้ Network ปกติ

---

## NFR-002 Responsive

ระบบต้องรองรับ:

- Mobile
- Tablet
- Desktop

แต่ Mobile ต้องเป็น Priority หลัก

---

## NFR-003 Security

- Backend ต้อง Validate Barcode
- ห้ามเชื่อข้อมูลราคาจาก Client โดยตรง
- Admin API ต้องมี Authentication
- Admin API ต้องมี Authorization
- Database ต้องไม่เปิดให้ Mobile Client เข้าถึงโดยตรง

---

## NFR-004 Availability

หากระบบ Backend ไม่สามารถใช้งานได้ ระบบต้องแสดง:

```text
ไม่สามารถเชื่อมต่อระบบได้
กรุณาลองใหม่อีกครั้ง
```

---

# 12. System Architecture

```text
                    Mobile Browser
                          │
                          │
                    Scan Barcode
                          │
                          ▼
                ┌─────────────────┐
                │    Next.js      │
                │    Frontend     │
                └────────┬────────┘
                         │
                       HTTPS
                         │
                         ▼
                ┌─────────────────┐
                │   Spring Boot   │
                │      API        │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   PostgreSQL    │
                │                 │
                │    Products     │
                │ Product Prices  │
                └─────────────────┘
```

---

# 13. Main User Flow

```text
START
  │
  ▼
Open Website
  │
  ▼
Scan Barcode
  │
  ▼
Barcode Detected
  │
  ▼
Call API
  │
  ▼
Product Found?
  │
  ├── NO ──► Show "Product Not Found"
  │
  └── YES
        │
        ▼
   Get Current Price
        │
        ▼
   Show Product
        │
        ▼
   Show Price
        │
        ▼
   Scan Again
        │
        └──────────► Scan Barcode
```

---

# 14. Suggested Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Barcode

Frontend ต้องใช้ Barcode Scanner ที่รองรับการอ่านผ่าน Camera ของ Browser

## Backend

- Spring Boot
- Java
- REST API

## Database

- PostgreSQL

## Deployment

ตัวอย่าง:

```text
Internet
   │
   ▼
HTTPS
   │
   ├── Next.js
   │
   └── Spring Boot API
             │
             ▼
         PostgreSQL
```

---

# 15. MVP Development Phases

## Phase 1 — Product Database

- [ ] Create products table
- [ ] Create product_prices table
- [ ] Create Product Entity
- [ ] Create ProductPrice Entity
- [ ] Create initial seed data

## Phase 2 — Backend API

- [ ] GET product by Barcode
- [ ] POST product
- [ ] PUT product
- [ ] POST product price
- [ ] GET price history
- [ ] Error handling
- [ ] Validation

## Phase 3 — Mobile Scanner

- [ ] Create Scan Page
- [ ] Request Camera Permission
- [ ] Barcode Scanner
- [ ] Barcode validation
- [ ] Manual Barcode Input
- [ ] API integration

## Phase 4 — Product Result

- [ ] Product information
- [ ] Current price
- [ ] Product status
- [ ] Scan Again

## Phase 5 — Admin

- [ ] Product management
- [ ] Price management
- [ ] Price history
- [ ] Authentication
- [ ] Authorization

## Phase 6 — Testing

- [ ] Test valid Barcode
- [ ] Test invalid Barcode
- [ ] Test product not found
- [ ] Test camera permission denied
- [ ] Test API error
- [ ] Test slow network
- [ ] Test multiple mobile devices
- [ ] Test price update
- [ ] Test price history

---

# 16. Acceptance Criteria

ระบบถือว่า MVP เสร็จเมื่อ:

- [ ] User เปิดระบบจากมือถือได้
- [ ] User เปิด Camera ได้
- [ ] User สามารถ Scan Barcode ได้
- [ ] ระบบอ่าน Barcode ได้ถูกต้อง
- [ ] ระบบค้นหาสินค้าจาก Barcode ได้
- [ ] ระบบแสดงชื่อสินค้าถูกต้อง
- [ ] ระบบแสดงราคาปัจจุบันถูกต้อง
- [ ] ระบบแสดงสินค้าไม่พบเมื่อ Barcode ไม่มีในระบบ
- [ ] User สามารถกรอก Barcode เองได้
- [ ] User สามารถ Scan สินค้าต่อได้
- [ ] Admin สามารถเพิ่มสินค้าได้
- [ ] Admin สามารถเปลี่ยนราคาได้
- [ ] ระบบเก็บประวัติราคาได้
- [ ] ระบบไม่เปิด Database ให้ Client เข้าถึงโดยตรง
- [ ] API ใช้งานผ่าน HTTPS
- [ ] ระบบรองรับ Mobile เป็นหลัก

---

# 17. Future Enhancements

สามารถเพิ่มใน Version ถัดไป:

- แสดง Promotion
- แสดงราคาสมาชิก
- แสดง Stock
- แสดง Location ของสินค้า
- แสดงหลายสาขา
- รองรับ QR Code
- Product Search
- Scan History
- Offline Mode
- PWA
- Login Customer
- Analytics
- Dashboard
- Price Change Notification
- Import Product จาก Excel/CSV
- เชื่อมต่อ POS / ERP

---

# 18. Recommended MVP

สำหรับ Version แรกไม่ควรทำระบบใหญ่เกินไป

แนะนำให้เริ่มเพียง:

```text
Mobile
  │
  ├── Scan Barcode
  │
  ├── Manual Barcode
  │
  └── Show Price
          │
          ▼
       Backend
          │
          ▼
       Database
```

และฝั่ง Admin:

```text
Admin
  │
  ├── Product CRUD
  │
  ├── Update Price
  │
  └── Price History
```

เมื่อ MVP ใช้งานได้แล้วจึงค่อยเพิ่ม Stock, Promotion, Member Price และระบบอื่น ๆ
