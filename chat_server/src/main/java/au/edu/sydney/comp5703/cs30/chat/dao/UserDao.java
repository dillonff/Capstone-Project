package au.edu.sydney.comp5703.cs30.chat.dao;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

@Repository
public class UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    public User getUserById(long userId) {
        try {
            return entityManager.createQuery("SELECT u FROM users u WHERE u.id=:userId", User.class)
                    .setParameter("userId", userId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

}