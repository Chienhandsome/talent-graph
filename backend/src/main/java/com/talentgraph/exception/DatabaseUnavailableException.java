package com.talentgraph.exception;

public class DatabaseUnavailableException extends AppException {

    public DatabaseUnavailableException() {
        super("Career data is temporarily unavailable. Please try again.", "DATABASE_UNAVAILABLE", 503);
    }

    public DatabaseUnavailableException(Throwable cause) {
        super("Career data is temporarily unavailable. Please try again.", "DATABASE_UNAVAILABLE", 503, cause);
    }
}
