package au.edu.sydney.comp5703.cs30.chat.service;

import au.edu.sydney.comp5703.cs30.chat.dao.MessageDao;
import au.edu.sydney.comp5703.cs30.chat.entity.Message;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class MessageService {

    private final MessageDao messageDao;

    public MessageService(MessageDao messageDao) {

        this.messageDao = messageDao;
    }

    public Message getMessageByChannelID(int channelID) {
        return messageDao.getMessageByChannelID(channelID);
    }

    public Message getMessageByMessageID(int messageID) {
        return MessageDao.getMessageByMessageID(messageID);
    }

    public Message getMessageAfterMessageID(int messageID) {
        return MessageDao.getMessageAfterMessageID(messageID);
    }

    public Message getMessageAfterTime(Date date) {
        return MessageDao.getMessageAfterTime(date);
    }
}