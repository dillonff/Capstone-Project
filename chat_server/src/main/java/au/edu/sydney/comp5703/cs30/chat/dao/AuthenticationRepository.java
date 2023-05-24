@Repository
public interface AuthenticationRepository extends CrudRepository<Customer, Long> {

    @Query(value = "SELECT u FROM User u where u.userName = ?1 and u.password = ?2 ")
    Optional login(String username,String password);
    Optional findByToken(String token);
}