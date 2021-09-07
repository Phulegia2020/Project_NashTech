package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.exception.InvalidDataException;
import com.example.nashtechproject.exception.ObjectExistedException;
import com.example.nashtechproject.exception.ObjectNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@ControllerAdvice
public class ExceptionController extends ResponseEntityExceptionHandler {
    @ExceptionHandler(InvalidDataException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public void InvalidDataException(HttpServletResponse response, InvalidDataException ex) throws IOException {
        System.err.println(ex.getMessage());
        response.sendError(400);
    }

    @ExceptionHandler(ObjectNotFoundException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public void handleObjectNotFoundException(HttpServletResponse response, ObjectNotFoundException ex) throws IOException {
        System.err.println(ex.getMessage());
        response.sendError(404);
    }

    @ExceptionHandler(ObjectExistedException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public void handleObjectExistedException(HttpServletResponse response, ObjectExistedException ex) throws IOException {
        System.err.println(ex.getMessage());
        response.sendError(409);
    }
}
