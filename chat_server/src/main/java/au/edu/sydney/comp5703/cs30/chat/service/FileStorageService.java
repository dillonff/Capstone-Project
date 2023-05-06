package au.edu.sydney.comp5703.cs30.chat.service;

import org.springframework.web.multipart.MultipartFile;

public class FileStorageService {
    // TODO: implement this

    public String store(MultipartFile file, Object... anyOtherArgs) {
        // TODO: save file to the local filesystem and return its path
        // be aware: duplicate or malformed name might be provided by the user.
        String name = file.getName();

        return "";
    }

    // any other functions whichever are appropriate
}
