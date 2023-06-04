package au.edu.sydney.comp5703.cs30.chat.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public @ResponseBody ErrorBody eHandler(jakarta.servlet.http.HttpServletRequest req, HttpServletResponse response, ResponseStatusException e) throws Exception {
        e.printStackTrace();
        response.setStatus(e.getStatusCode().value());
        return buildErrorBody(e.getReason());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Throwable.class)
    public @ResponseBody ErrorBody defaultErrorHandler(jakarta.servlet.http.HttpServletRequest req, Throwable t) throws Exception {
        t.printStackTrace();
        return buildErrorBody("Unknown server error");
    }

    class ErrorBody {
        public final Boolean ok = false;
        public final String message;

        public ErrorBody(String message) {
            this.message = message;
        }
    }

    private ErrorBody buildErrorBody(String message) {
        return new ErrorBody(message);
    }
}
