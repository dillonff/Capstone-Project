package au.edu.sydney.comp5703.cs30.chat.model;

public class PinChannelResponse {
    private Long channelId;
    private boolean isPinned;

    public PinChannelResponse(Long channelId, boolean isPinned) {
        this.channelId = channelId;
        this.isPinned = isPinned;
    }

    public Long getChannelId() {
        return channelId;
    }

    public void setChannelId(Long channelId) {
        this.channelId = channelId;
    }

    public boolean isPinned() {
        return isPinned;
    }

    public void setPinned(boolean pinned) {
        isPinned = pinned;
    }
}
