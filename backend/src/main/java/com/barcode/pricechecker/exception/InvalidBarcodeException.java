package com.barcode.pricechecker.exception;

public class InvalidBarcodeException extends RuntimeException {

    public InvalidBarcodeException(String message) {
        super(message);
    }
}
