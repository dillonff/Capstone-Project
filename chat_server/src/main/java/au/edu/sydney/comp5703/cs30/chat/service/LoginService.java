@Service
public class LoginService {

    @Resource
    private LoginMapper loginMapper;

    public User LoginIn(String username, String password) {
        return loginMapper.getInfo(username,password);
    }
}