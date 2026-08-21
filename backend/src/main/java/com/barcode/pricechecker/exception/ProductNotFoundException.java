package com.barcode.pricechecker.exception;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(String barcode) {
        super("ไม่พบสินค้าที่ตรงกับ Barcode นี้: " + barcode);
    }
}
