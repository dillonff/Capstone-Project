@Controller
public class TokenController {

    @Autowired
    private AuthenticationRepository authenticationRepository;

    @PostMapping("/token")
    public String getToken(@RequestParam("username") final String username, @RequestParam("password") final String password){
        String token= authenticationRepository.login(username,password);
        if(StringUtils.isEmpty(token)){
            return "no token found";
        }
        return token;
    }
}