package au.edu.sydney.comp5703.cs30.chat.model;

import lombok.Data;

@Data
public class UpdateUserInfoRequest {
    private String oldPassword;
    private String newPassword;
    private String username;
    private String email;
    private String phone;
    private Long id;




}
