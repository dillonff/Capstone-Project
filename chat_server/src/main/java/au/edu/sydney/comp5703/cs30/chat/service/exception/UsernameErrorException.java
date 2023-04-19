package au.edu.sydney.comp5703.cs30.chat.service.exception;

import au.edu.sydney.comp5703.cs30.chat.service.ServiceException;

public class UsernameErrorException extends ServiceException {
    public UsernameErrorException() {
        super();
    }

    public UsernameErrorException(String message) {
        super(message);
    }


}
