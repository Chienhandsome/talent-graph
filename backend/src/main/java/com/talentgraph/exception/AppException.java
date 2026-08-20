package com.talentgraph.exception;

public abstract class AppException extends RuntimeException {

    private final String code;
    private final int statusCode;

    public AppException(String message, String code, int statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }

    public AppException(String message, String code, int statusCode, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.statusCode = statusCode;
    }

    public String getCode() {
        return code;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
