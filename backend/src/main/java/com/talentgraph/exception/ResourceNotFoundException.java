package com.talentgraph.exception;

public class ResourceNotFoundException extends AppException {

    public ResourceNotFoundException(String resource) {
        super(resource + " was not found.", "NOT_FOUND", 404);
    }
}
