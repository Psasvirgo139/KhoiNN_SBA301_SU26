package com.fu.A2Khoi_sba301.exception;

/**
 * TODO-05: 409 - vi pham rang buoc nghiep vu
 * (xoa account/category dang duoc dung, trung ID/email...)
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
