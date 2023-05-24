@Service()
public class AuthenticationService implements AuthenticationRepository {

    @Autowired
    AuthenticationRepository AuthenticationRepository;

    @Override
    public String login(String username, String password) {//once user login successfully, return a token
        Optional customer = authenticationRepository.login(username,password);
        if(customer.isPresent()){
            String token = UUID.randomUUID().toString();//using uuid to randomly generate a string for token
            Customer custom= customer.get();
            custom.setToken(token);
            AuthenticationRepository.save(custom);
            return token;
        }

        return StringUtils.EMPTY;
    }

    @Override
    public Optional findByToken(String token) {//find a user by token
        Optional customer= authenticationRepository.findByToken(token);
        if(customer.isPresent()){
            Customer customer1 = customer.get();
            User user= new User(customer1.getUserName(), customer1.getPassword(), true, true, true, true,
                    AuthorityUtils.createAuthorityList("USER"));
            return Optional.of(user);
        }
        return  Optional.empty();
    }
}