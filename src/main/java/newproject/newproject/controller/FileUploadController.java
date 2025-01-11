package newproject.newproject.controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import newproject.newproject.service.fileUpload.FileUploadService;
import newproject.newproject.service.products.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequestMapping("/upload")
@RequiredArgsConstructor
public class FileUploadController {
    @Autowired
    UsersRepository usersRepository;
    @Autowired
    ProductRepository productRepository;

    private final FileUploadService fileUploadService;
    private final ProductsService productsService;

    public static String uploadDirecotry = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/uploadprofilepic")
    public ResponseEntity<String> uploadProfilePic(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes, Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            String fileName = fileUploadService.uploadProfilePicture(file, principal, authentication);
            redirectAttributes.addFlashAttribute("uploadingResult", "Successfully saved file: " + fileName);
            return ResponseEntity.ok("File saved");
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("uploadingResult", "Failed to save file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save file");
        }
    }


    @PostMapping("/uploadproductspics/{productId}")
    public ResponseEntity<String> uploadProductPics(@RequestParam("file") MultipartFile[] file, @PathVariable UUID productId, RedirectAttributes redirectAttributes, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            String fileNames = fileUploadService.uploadProductPics(file, productId, authentication);
            redirectAttributes.addFlashAttribute("uploadingResult", "Successfully saved files: " + fileNames);
            return ResponseEntity.ok("File saved");
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("uploadingResult", "Failed to save file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save file");
        }
    }

    @PostMapping("/uploadeditedproductspics/{productId}")
    public ResponseEntity<String> uploadEditedProductPics(@RequestParam("file") MultipartFile[] file, @PathVariable UUID productId, RedirectAttributes redirectAttributes, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            String fileNames = fileUploadService.uploadEditedProductPics(file, productId, authentication);
            redirectAttributes.addFlashAttribute("uploadingResult", "Successfully saved files: " + fileNames);
            return ResponseEntity.ok("File saved");
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("uploadingResult", "Failed to save file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save file");
        }
    }
}