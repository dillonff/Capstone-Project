package au.edu.sydney.comp5703.cs30.chat.model;

import org.apache.ibatis.ognl.BooleanExpression;

public class CreateChannelRequest {
    private String name;
    private Long workspace;

    private Long peerMemberId;

    private int peerMemberType;

    private boolean publicChannel;

    private boolean autoJoin;

    public String getName() {
        return name;
    }

    public Long getWorkspace() {
        return workspace;
    }


    public Long getPeerMemberId() {
        return peerMemberId;
    }

    public int getPeerMemberType() {
        return peerMemberType;
    }

    public boolean isPublicChannel() {
        return publicChannel;
    }

    public boolean shouldAutoJoin() {
        return autoJoin;
    }
}
