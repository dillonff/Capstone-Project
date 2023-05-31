package au.edu.sydney.comp5703.cs30.chat.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
public class File {
    private Long id;
    private String filename;
    private String path;
    private long size;
    private Byte status;
    private Instant timeCreated;
    private Long uploaderId;
    private String uploaderName;
    private String workspace;
    private SortOptions sortOptions;

    public File(String filename, String path, long size, long uploaderId) {
        this.filename = filename;
        this.path = path;
        this.size = size;
        this.uploaderId = uploaderId;
        this.status = 0;
    }
    @Data
    class SortOptions{
        private String sortField;
        private String sortOrder;
    }
}
