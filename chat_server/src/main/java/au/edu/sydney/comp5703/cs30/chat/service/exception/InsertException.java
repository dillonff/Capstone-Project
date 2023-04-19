package au.edu.sydney.comp5703.cs30.chat.service.exception;

import au.edu.sydney.comp5703.cs30.chat.service.ServiceException;

public class InsertException extends ServiceException {
    public InsertException() {
        super();
    }

    public InsertException(String message) {
        super(message);
    }


}