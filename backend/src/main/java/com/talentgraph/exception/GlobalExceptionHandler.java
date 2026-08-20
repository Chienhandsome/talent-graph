package com.talentgraph.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AppException.class)
    public ResponseEntity<Map<String, Object>> handleAppException(AppException e) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("code", e.getCode());
        error.put("message", e.getMessage());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", error);

        return ResponseEntity.status(e.getStatusCode()).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException e) {
        List<Map<String, String>> issues = new ArrayList<>();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            Map<String, String> issue = new LinkedHashMap<>();
            issue.put("path", fieldError.getField());
            issue.put("message", fieldError.getDefaultMessage());
            issues.add(issue);
        }

        Map<String, Object> error = new LinkedHashMap<>();
        error.put("code", "INVALID_REQUEST");
        error.put("message", "The request contains invalid values.");
        error.put("issues", issues);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", error);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableRequest(HttpMessageNotReadableException e) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("code", "INVALID_REQUEST");
        error.put("message", "Request body must be valid JSON and contain only supported fields.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception e) {
        log.error("Unhandled exception caught in GlobalExceptionHandler", e);

        Map<String, Object> error = new LinkedHashMap<>();
        error.put("code", "INTERNAL_ERROR");
        error.put("message", "An unexpected error occurred.");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", error);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
