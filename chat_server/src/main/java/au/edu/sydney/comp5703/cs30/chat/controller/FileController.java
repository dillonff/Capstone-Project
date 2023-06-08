package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.File;
import au.edu.sydney.comp5703.cs30.chat.mapper.FileMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.payload.UploadFileResponse;
import au.edu.sydney.comp5703.cs30.chat.service.FileStorageService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static au.edu.sydney.comp5703.cs30.chat.controller.ControllerHelper.getCurrentUser;


@RestController
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private FileMapper fileMapper;

    @Autowired
    private UserMapper userMapper;

    @PostMapping(value = "/api/v1/files", produces = "application/json")
    public File uploadFile(@RequestParam("file") MultipartFile mf) {
        var user = getCurrentUser();
        var file = fileStorageService.storeFile(mf, user.getId());
        return file;
    }

//    @PostMapping("/uploadMultipleFiles")
//    public List<File> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
//        return Arrays.asList(files)
//                .stream()
//                .map(file -> uploadFile(file))
//                .collect(Collectors.toList());
//    }

    @PostMapping(value = "/api/v1/files/list", produces = "application/json")
    public List<Map<String, Object>> getFileInfo(@RequestBody File file) {
//        File file = new File();
//        file.setId(id);
        List<Map<String,Object>> fileList = fileMapper.findByIdList(file);
//        if (fileList.size() == 0) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found: " + file);
//        }
        return fileList;
    }

    @GetMapping("/api/v1/files/{id}/{fileNameHint}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        // Load file as Resource
        var file = fileMapper.findById(id);
        if (file == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found: " + id);
        }
        var resource = fileStorageService.loadFileAsResource(file);

        // Try to determine file's content type
        String contentType = null;
        contentType = null;


        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        var builder = ContentDisposition.builder("attachment");
        builder.filename(file.getFilename(), StandardCharsets.UTF_8);
        builder.filename(file.getFilename());
        var contentDisposition = builder.build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(resource);
    }
}

