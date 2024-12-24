package newproject.newproject.controller;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
class FileUploadControllerTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private RedirectAttributes redirectAttributes;

    @Mock(lenient = true)
    private Principal principal;

    @Mock
    private OAuth2User authentication;

    @InjectMocks
    private FileUploadController fileUploadController;

    private String uploadDirectory;

    @BeforeEach
    void setUp() {
        uploadDirectory = System.getProperty("user.dir") + "/uploads/";

        UserModel currentUser = new UserModel();
        currentUser.setUserName("testuser");
        currentUser.setProfilePicture(uploadDirectory + "oldProfilePic.jpg");
        when(usersRepository.findByEmail("testuser")).thenReturn(currentUser);
    }

    @Test
    void testFileUpload() throws IOException {

        MockMultipartFile file = new MockMultipartFile("file", "testProfilePic.jpg", "image/jpeg", "test content".getBytes());

        UsernamePasswordAuthenticationToken principalToken = new UsernamePasswordAuthenticationToken("testuser", "password");
        when(principal.getName()).thenReturn("testuser");

        ResponseEntity<String> response = fileUploadController.uploadProfilePic(file, redirectAttributes, principalToken, authentication);

        Path filePath = Paths.get(uploadDirectory, "testuser_testProfilePic.jpg");
        assertTrue(Files.exists(filePath));

        UserModel updatedUser = usersRepository.findByEmail("testuser");
        assertEquals(uploadDirectory + "testProfilePic.jpg", updatedUser.getProfilePicture());

        assertEquals("File saved", response.getBody());
    }

}