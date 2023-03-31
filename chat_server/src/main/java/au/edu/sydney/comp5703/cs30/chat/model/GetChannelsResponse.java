package au.edu.sydney.comp5703.cs30.chat.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.util.List;

public class GetChannelsResponse {

    private static class channelIdsSerializer extends JsonSerializer<List<Long>> {

        @Override
        public void serialize(List<Long> longs, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            jsonGenerator.writeStartArray();
            for (var id : longs) {
                jsonGenerator.writeStartObject();
                jsonGenerator.writeObjectField("channelIds", id);
                jsonGenerator.writeEndObject();
            }
            jsonGenerator.writeEndArray();
        }
    }
    private List<Long> channelIds;

    public GetChannelsResponse(List<Long> channelIds) {
        this.channelIds = channelIds;
    }

    public List<Long> getChannelIds() {
        return channelIds;
    }
}
