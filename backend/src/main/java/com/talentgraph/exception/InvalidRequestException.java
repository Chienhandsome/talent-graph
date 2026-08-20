package com.talentgraph.exception;

public class InvalidRequestException extends AppException {

    public InvalidRequestException(String message) {
        super(message, "INVALID_REQUEST", 400);
    }
}
