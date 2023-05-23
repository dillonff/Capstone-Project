package au.edu.sydney.comp5703.cs30.chat.service;

import au.edu.sydney.comp5703.cs30.chat.entity.File;
import au.edu.sydney.comp5703.cs30.chat.mapper.FileMapper;
import au.edu.sydney.comp5703.cs30.chat.property.FileStorageProperties;
import au.edu.sydney.comp5703.cs30.chat.service.exception.FileStorageException;
import au.edu.sydney.comp5703.cs30.chat.service.exception.MyFileNotFoundException;
import org.apache.catalina.webresources.FileResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.InvalidMimeTypeException;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.regex.Pattern;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    private FileMapper fileMapper;
    private static Pattern removePattern = Pattern.compile("[^_\\- .(),#+\\d\\p{L}]");

    @Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties, FileMapper fileMapper) {
        this.fileMapper = fileMapper;
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public File storeFile(MultipartFile mf, Long uploaderId) {
        // Normalize file name
        var rawName = mf.getOriginalFilename();
        if (!StringUtils.hasLength(rawName)) {
            if (mf.isEmpty()) {
                throw new FileStorageException("The file is missing");
            }
            rawName = generateNameForMultipartFile(mf, uploaderId);
        }
        var name = cleanName(rawName);
        var fsName = cleanNameForFs(rawName);
        var file = new File(name, "", 0, uploaderId);
        System.err.println(generateNameForMultipartFile(mf, uploaderId));
        file.setUploaderId(uploaderId);
        fileMapper.insertFile(file);
        var path = makeRelativePath(fsName, file.getId());
        var size = mf.getSize();

        Path targetLocation = this.fileStorageLocation.resolve(path);
        var outFile = targetLocation.toFile();
        try {
            // Copy file to the target location (Replacing existing file with the same name)
            createParentDirectories(targetLocation);
            if (!outFile.createNewFile()) {
                throw new FileAlreadyExistsException(targetLocation.toString() + " already exists");
            }
            var outStream = new FileOutputStream(outFile);
            var inStream = mf.getInputStream();
            copyStream(inStream, outStream);
            outStream.flush();
            var fd = outStream.getFD();
            fd.sync();
            outStream.close();
            inStream.close();
            outFile.length();
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + path + ". Please try again!", ex);
        }
        file.setPath(path.toString());
        file.setStatus((byte) 1);
        if (outFile.length() != size) {
            try {
                Files.delete(targetLocation);
            } catch (IOException e) {
                throw new FileStorageException("Could not delete file " + path, e);
            }
            throw new FileStorageException("Stored file length mismatches the multipart file: " + path);
        }
        file.setSize(size);
        fileMapper.updateFile(file);
        return file;
    }

    private String generateNameForMultipartFile(MultipartFile mf, Long userId) {
        var sb = new StringBuilder();
        sb.append("user-");
        sb.append(userId);
        sb.append("-file-");
        var now = ZonedDateTime.now(ZoneOffset.UTC);
        sb.append(now.toString());
        MimeType mimeType = null;
        if (mf.getContentType() != null) {
            try {
                mimeType = MimeTypeUtils.parseMimeType(mf.getContentType());
            } catch (InvalidMimeTypeException e) {
            }
        }
        if (mimeType != null) {
            var suffix = mimeType.getSubtypeSuffix();
            if (suffix != null && !suffix.equals("")) {
                sb.append(".");
                sb.append(suffix);
            }
        }
        return sb.toString();
    }

    private void copyStream(InputStream in, OutputStream out) throws IOException {
        var buf = new byte[1048576];
        int nBytes;
        while ((nBytes = in.read(buf)) != -1) {
            out.write(buf, 0, nBytes);
        }
    }

    public Resource loadFileAsResource(File file) {
        Path filePath = this.fileStorageLocation.resolve(file.getPath()).normalize();
        var resource = new FileSystemResource(filePath);
        if(resource.exists()) {
            return resource;
        } else {
            throw new MyFileNotFoundException("File is missing: " + filePath);
        }
    }

    private String cleanNameForFs(String rawName) {
        var matcher = removePattern.matcher(rawName);
        var newName = matcher.replaceAll("_");
        newName = newName.substring(0, Math.min(48, newName.length()));
        newName = newName.trim();
        return newName;
    }

    private String cleanName(String rawName) {
        return rawName.substring(0, Math.min(127, rawName.length()));
    }

    private String getMonthString() {
        var time = LocalDate.now();
        var sb = new StringBuilder();
        sb.append(time.getYear());
        sb.append(String.format("%02d", time.getMonthValue()));
        return sb.toString();
    }

    private Path makeRelativePath(String name, Long id) {
        var month = getMonthString();
        var sb = new StringBuilder();
        sb.append(System.currentTimeMillis() / 1000);
        sb.append("-");
        sb.append(id);
        sb.append("-");
        sb.append(name);
        return Path.of(month, sb.toString());
    }

    private void createParentDirectories(Path path) throws IOException {
        var parent = path.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }
    }
}