package au.edu.sydney.comp5703.cs30.chat;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;

@Configuration
@SpringBootApplication
@MapperScan("au.edu.sydney.comp5703.cs30.chat.mapper")
public class ChatApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
	}

}
