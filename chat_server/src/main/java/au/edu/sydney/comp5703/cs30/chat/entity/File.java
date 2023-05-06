package au.edu.sydney.comp5703.cs30.chat.entity;

import java.time.Instant;

public class File {
    private Long id;
    private String filename;
    private String path;
    private Long size;
    private Byte status;
    private Instant timeCreated;
    private Long uploaderId;

    public File(String filename, String path, Long size, Long uploaderId) {
        this.filename = filename;
        this.path = path;
        this.size = size;
        this.uploaderId = uploaderId;
        this.status = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public Instant getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Instant timeCreated) {
        this.timeCreated = timeCreated;
    }

    public Long getUploaderId() {
        return uploaderId;
    }

    public void setUploaderId(Long uploaderId) {
        this.uploaderId = uploaderId;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }
}
