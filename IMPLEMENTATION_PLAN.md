# Implementation Plan - All Requested Features

## Status: In Progress

### 1. ✅ Coupon Code System
- ✅ Database schema (Coupon model, DiscountType enum)
- ✅ API routes created
- ⏳ Admin UI page needed
- ⏳ Checkout integration needed

### 2. ✅ Tools Delete & Out of Stock
- ✅ DELETE endpoint exists
- ✅ isOutOfStock field added to schema
- ⏳ Delete button in admin tools page
- ⏳ Out of stock badge display

### 3. ⏳ Google Analytics
- Need to add GA script to layout

### 4. ⏳ Duration Selection
- Need to add monthly/yearly toggle in checkout

### 5. ⏳ WhatsApp on Admin Panel
- Need to add WhatsApp button/contact in admin header

### 6. ⏳ Product Page
- Need to create `/tools/[slug]` page

## Files to Create/Modify

1. `src/app/admin/coupons/page.tsx` - Coupons management
2. `src/components/checkout/coupon-input.tsx` - Coupon input component
3. Update `src/app/admin/tools/page.tsx` - Add delete button & out of stock
4. Update `src/components/checkout/tool-checkout-client.tsx` - Add coupon & duration
5. `src/app/layout.tsx` - Add Google Analytics
6. `src/components/admin/admin-header.tsx` - Add WhatsApp button
7. `src/app/tools/[slug]/page.tsx` - Product detail page
