@Controller
public class LoginController {

    @Resource
    LoginService loginService;

    @RequestMapping(value = "/login",method = RequestMethod.POST)
    public String login(String username,String password){
        User user = loginService.LoginIn(username, password);
        //log.info("name:{}",username);
        //log.info("password:{}",password);
        if(user!=null){
            return "redirect:/index.html";
        }else {
            return "error";
        }
    }
    @RequestMapping("/index.html")
    public String mainPage(){
        return "index";
    }


