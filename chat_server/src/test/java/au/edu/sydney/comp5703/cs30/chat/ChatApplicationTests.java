package au.edu.sydney.comp5703.cs30.chat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.ls.LSOutput;

import javax.sql.DataSource;
import java.sql.SQLException;

@SpringBootTest
class ChatApplicationTests {

	@Autowired
	DataSource dataSource;

	@Test
	void contextLoads() {
	}

	@Test
	void getConnection() throws SQLException {
		System.out.println(dataSource.getConnection());
	}


}
