package au.edu.sydney.comp5703.cs30.chat.service.exception;

import au.edu.sydney.comp5703.cs30.chat.service.ServiceException;

public class PasswordErrorException extends ServiceException {
    public PasswordErrorException() {
        super();
    }

    public PasswordErrorException(String message) {
        super(message);
    }

}
