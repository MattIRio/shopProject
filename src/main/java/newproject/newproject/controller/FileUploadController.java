package newproject.newproject.controller;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import java.nio.file.Files;
import java.security.Principal;

@Controller
public class FileUploadController {
    @Autowired
    UsersRepository usersRepository;


    public static String uploadDirecotry = System.getProperty("user.dir")+"/uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String>  upload(Model model, @RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes, Principal principal) {
        String fileName = file.getOriginalFilename();
        Path fileNameAndPath = Paths.get(uploadDirecotry, fileName);
        try {
            Files.write(fileNameAndPath, file.getBytes());
            UserModel localUser = usersRepository.findByEmail(principal.getName());
            Files.delete(fileNameAndPath);
            localUser.setProfilePicture(uploadDirecotry + fileName);
            usersRepository.save(localUser);
            redirectAttributes.addFlashAttribute("uploadingResult", "Successfully uploaded file: " + fileName);
        } catch (IOException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("uploadingResult", "Failed to upload file: " + fileName);
        }
        return ResponseEntity.ok("File saved");
    }
}
