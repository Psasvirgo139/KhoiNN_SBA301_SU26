package com.lab04.orchidmanagement.exception;

public class OrchidNotFoundException extends RuntimeException {
    public OrchidNotFoundException(String message) {
        super(message);
    }
}
