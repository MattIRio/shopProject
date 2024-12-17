package newproject.newproject.controller;

import jakarta.transaction.Transactional;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
    @Transactional
    @PostMapping("/upload")
    public ResponseEntity<String>  upload(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes, Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = null;
        if (principal instanceof OAuth2AuthenticationToken){
            currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
        } else if (principal instanceof UsernamePasswordAuthenticationToken){
            currentUser = usersRepository.findByEmail(principal.getName());
        }

        String fileName = file.getOriginalFilename();
        Path fileNameAndPath = Paths.get(uploadDirecotry, currentUser.getEmail() + "_" + fileName );
        try {
            Path currentProfilePic = Path.of(usersRepository.findByEmail(currentUser.getEmail()).getProfilePicture());
            if(Files.exists(currentProfilePic)) {
                Files.delete(currentProfilePic);
            }
            Files.write(fileNameAndPath, file.getBytes());
            UserModel localUser = usersRepository.findByEmail(currentUser.getEmail());
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
