package au.edu.sydney.comp5703.cs30.chat.model;

public class GetUserResponse {
    Long UserId;
    String UserName;
    String UserDisplayName;
    public GetUserResponse(Long UserId, String UserName){

        this.UserId = UserId;
        this.UserName = UserName;
    }
}
