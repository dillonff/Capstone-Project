package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.service.FileStorageService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public class FileController {

    private FileStorageService storageService;

    @RequestMapping(
            value = "/api/v1/files", produces = "application/json", method = RequestMethod.POST
    )
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        // TODO save file to local filesystem and save file info to db

        return "";  // TODO: returns  file id
    }
}
