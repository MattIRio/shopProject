package newproject.newproject.controller;

import jakarta.transaction.Transactional;
import newproject.newproject.controller.autentification.SignUpController;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Transactional
@ExtendWith(MockitoExtension.class)
class signUpControllerTest {
    @Mock
    private RedirectAttributes redirectAttributes;
    @Mock
    UsersRepository usersRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private SignUpController signUpController;


    @Test
    void createUser_Success() {
        UserModel user = new UserModel();
        user.setEmail("emailtest");
        user.setPassword("passwordtest");
        assertEquals("redirect:/loginPage", signUpController.createUser(user,redirectAttributes));
    }

    @Test
    void createUser_NullUserModel() {
        String result = signUpController.createUser(null, redirectAttributes);
        assertEquals("redirect:/signUpPage", result);
    }

    @Test
    void createUser_UserExist() {
        UserModel user = new UserModel();
        user.setEmail("emailtest");
        user.setPassword("passwordtest");

        Mockito.when(usersRepository.findByEmail("emailtest")).thenReturn(new UserModel());

        String result = signUpController.createUser(user, redirectAttributes);

        assertEquals("redirect:/signUpPage", result);
    }

    @Test
    void createUser_ExceptionHandling() {
        UserModel user = new UserModel();
        user.setEmail("emailtest");
        user.setPassword("passwordtest");

        Mockito.when(usersRepository.findByEmail("emailtest")).thenThrow(new RuntimeException("Database error"));

        String result = signUpController.createUser(user, redirectAttributes);

        Mockito.verify(redirectAttributes).addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
        assertEquals("redirect:/signUpPage", result);
    }
}