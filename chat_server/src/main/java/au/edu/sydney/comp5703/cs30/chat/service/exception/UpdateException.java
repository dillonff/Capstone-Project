package au.edu.sydney.comp5703.cs30.chat.service.exception;

import au.edu.sydney.comp5703.cs30.chat.service.ServiceException;

public class UpdateException extends ServiceException {
    public UpdateException(String message) {
        super(message);
    }
}
