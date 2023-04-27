package au.edu.sydney.comp5703.cs30.chat.model;

import au.edu.sydney.comp5703.cs30.chat.entity.Message;

import java.util.List;

public class GetMessageResponse {
    private List<Message> messages;

    public GetMessageResponse(List<Message> messages) {
        this.messages = messages;
    }

    public List<Message> getMessages() {
        return messages;
    }
}
