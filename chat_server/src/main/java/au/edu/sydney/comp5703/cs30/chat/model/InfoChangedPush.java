package au.edu.sydney.comp5703.cs30.chat.model;

public class InfoChangedPush {
    private String infoType;

    public InfoChangedPush(String infoType) {
        this.infoType = infoType;
    }

    public String getInfoType() {
        return infoType;
    }
}
