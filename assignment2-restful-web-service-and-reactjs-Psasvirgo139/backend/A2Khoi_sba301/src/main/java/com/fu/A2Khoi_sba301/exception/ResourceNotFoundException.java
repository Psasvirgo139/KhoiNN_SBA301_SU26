package com.fu.A2Khoi_sba301.exception;

/**
 * TODO-05: 404 - khong tim thay resource
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
