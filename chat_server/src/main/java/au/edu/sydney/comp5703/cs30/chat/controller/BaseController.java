package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.service.ServiceException;
import au.edu.sydney.comp5703.cs30.chat.service.exception.*;
import au.edu.sydney.comp5703.cs30.chat.util.JsonResult;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpSession;

public class BaseController {
    public static final int OK = 200;
    protected final Integer getUidFromSession(HttpSession session) {
        return Integer.valueOf(session.getAttribute("uid").toString());
    }

    protected final String getUsernameFromSession(HttpSession session) {
        return session.getAttribute("username").toString();
    }

    @ExceptionHandler({ServiceException.class, FileUploadException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public JsonResult<Void> handleException(Throwable e) {
        JsonResult<Void> result = new JsonResult<>(e);
        if (e instanceof DuplicateUsernameException) {
            result.setState(4000);
            result.setMessage("username has been used");
        } else if (e instanceof UsernameErrorException) {
            result.setState(4001);
            result.setMessage("user data doesn't exist");
        } else if (e instanceof PasswordErrorException) {
            result.setState(4002);
            result.setMessage("password error");
        }  else if (e instanceof InsertException) {
            result.setState(5000);
            result.setMessage("error when inputting");
        } else if (e instanceof UpdateException) {
            result.setState(5001);
            result.setMessage("error when updating");
        }
        return result;
    }
}
