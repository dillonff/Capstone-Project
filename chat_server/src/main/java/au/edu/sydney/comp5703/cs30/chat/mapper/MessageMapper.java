package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.Message;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Mapper
@Repository
public interface MessageMapper {
    Integer insertMessage(Message message);

    List<Message> filterMessages(
            Long id,
            Long channelId,
            Instant afterTime,
            Instant beforeTime,
            Instant notAfterTime,
            Instant notBeforeTime,
            boolean isDesc,
            long offset,
            long count
    );
}
