package newproject.newproject.controller;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

import static newproject.newproject.model.UserModel.UserType.BUYER;
import static newproject.newproject.model.UserModel.UserType.SELLER;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
class UserControllerTest {
    @Mock
    Principal principal;
    @InjectMocks
    UserController userController;
    @Mock
    UsersRepository usersRepository;
    @Mock
    private RedirectAttributes redirectAttributes;


    @Test
    void saveUser() {
        OAuth2User authentication = mock(OAuth2User.class);
        UsernamePasswordAuthenticationToken principal =
                new UsernamePasswordAuthenticationToken("currentuser@example.com", null);

        UserModel mockUserCurrent = new UserModel();
        mockUserCurrent.setUserName("current user");
        mockUserCurrent.setPhoneNumber("current phone");
        mockUserCurrent.setUserType(SELLER);
        Mockito.when (usersRepository.findByEmail(principal.getName())).thenReturn(mockUserCurrent);

        UserModel mockUserNew = new UserModel();
        mockUserNew.setUserName("New user");
        mockUserNew.setPhoneNumber("New phone");
        mockUserNew.setUserType(BUYER);

        userController.saveUser(mockUserNew, principal, redirectAttributes, authentication);
        assertEquals(mockUserCurrent.getUserName(),mockUserNew.getUserName());
    }


    @Test
    void deleteCurrentUser() {

    }
}