package au.edu.sydney.comp5703.cs30.chat.service;

import au.edu.sydney.comp5703.cs30.chat.dao.ChannelDao;
import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import org.springframework.stereotype.Service;

@Service
public class ChannelService {
    private final ChannelDao channelDao;

    public ChannelService(ChannelDao channelDao) {
        this.channelDao = channelDao;
    }

    public Channel getChannel(long channelId) {
        return channelDao.getChannelById(channelId);
    }
}
