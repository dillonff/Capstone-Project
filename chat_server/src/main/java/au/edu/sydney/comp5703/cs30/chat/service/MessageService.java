@Service
public class MessageService {

    private final MessageDao messageDao;

    public MessageService(MessageDao messageDao) {

        this.messageDao = messageDao;
    }

    public Message getMessageByChannelID(int channelID) {
        return MessageDao.getMessageByChannelID(channelID);
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