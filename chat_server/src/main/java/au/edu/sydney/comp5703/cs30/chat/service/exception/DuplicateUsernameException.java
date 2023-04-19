package au.edu.sydney.comp5703.cs30.chat.service.exception;

import au.edu.sydney.comp5703.cs30.chat.service.ServiceException;

public class DuplicateUsernameException extends ServiceException {
    public DuplicateUsernameException() {
        super();
    }

    public DuplicateUsernameException(String message) {
        super(message);
    }

}
