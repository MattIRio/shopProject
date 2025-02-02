package newproject.newproject.service.fileUpload;

import jakarta.transaction.Transactional;
import newproject.newproject.authentication.OauthAndPrincipalAuthController;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {
    @Autowired
    UsersRepository usersRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    OauthAndPrincipalAuthController oauthAndPrincipalAuthController;

    // public static String uploadDirecotry = System.getProperty("user.dir")+"/uploads/";
    public static String uploadDirecotry = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";

    @Transactional
    public String uploadProfilePicture(MultipartFile file, Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);
        String fileName = file.getOriginalFilename();
        Path fileNameAndPath = Paths.get(uploadDirecotry, currentUser.getUserName() + "_" + fileName);
        try {
        if (currentUser.getProfilePicture() != null) {
            Path currentProfilePic = Path.of(currentUser.getProfilePicture());
            if (currentProfilePic != null) {
                Files.deleteIfExists(currentProfilePic);
                currentUser.setProfilePicture(null);
            }
        }
        Files.write(fileNameAndPath, file.getBytes());
        UserModel localUser = usersRepository.findByEmail(currentUser.getEmail());
        localUser.setProfilePicture(uploadDirecotry + currentUser.getUserName() + "_" + fileName);
        usersRepository.save(localUser);

        }catch (IOException e) {
            System.err.println("Failed to delete file: " + fileNameAndPath);
        }
        return fileName;
    }


    public String uploadProductPics(MultipartFile[] file, @PathVariable UUID productId, @AuthenticationPrincipal OAuth2User authentication) {
        if (file.length > 10) {
            throw new IllegalArgumentException();
        }

        ProductModel currentProduct = productRepository.findByUniqId(productId);
        List<String> urls = new ArrayList<>();
        try {
            for (MultipartFile image : file) {
                String fileName = image.getOriginalFilename();
                Path fileNameAndPath = Paths.get("");
                if (currentProduct.getImage() != null && currentProduct.getImage().contains(fileName)) {
                    fileNameAndPath = Paths.get(uploadDirecotry + fileName);
                    Files.delete(Path.of(fileNameAndPath.toUri()));
                } else {
                    fileNameAndPath = Paths.get(uploadDirecotry, currentProduct.getUniqId() + "_" + fileName);
                }
                Files.write(fileNameAndPath, image.getBytes());
                urls.add(String.valueOf(fileNameAndPath));
            }
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
        currentProduct.setImage(urls.toString());
        productRepository.save(currentProduct);
        return urls.toString();
    }


//    public String uploadEditedProductPics(MultipartFile[] file, @PathVariable UUID productId, @AuthenticationPrincipal OAuth2User authentication) {
//
//        ProductModel currentProduct = productRepository.findByUniqId(productId);
//        List<String> urls = new ArrayList<>();
//        try {
//            for (MultipartFile image : file){
//                String fileName = image.getOriginalFilename();
//                Path fileNameAndPath = Paths.get(uploadDirecotry, "_" + fileName);
//
//                if (currentProduct.getImage() != null) {
//                    String imageString = currentProduct.getImage();
//                    String cleanedString = imageString.substring(1, imageString.length() - 1);
//                    String[] images = cleanedString.split(",\\s*");
//
//                    for (String oldImage : images) {
//                        if (Files.exists(Path.of(oldImage))) {
//                            Files.delete(Path.of(oldImage));
//                        }
//                    }
//                    currentProduct.setImage(null);
//                }
//
//                Files.write(fileNameAndPath, image.getBytes());
//                urls.add(String.valueOf(fileNameAndPath));
//            }
//
//            currentProduct.setImage(urls.toString());
//            productRepository.save(currentProduct);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        return urls.toString();
//    }
}
