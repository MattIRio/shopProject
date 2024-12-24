package newproject.newproject.authentication;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.security.Principal;
@Service
public class OauthAndPrincipalAuthController {
    @Autowired
    UsersRepository usersRepository;

    public UserModel getCurrentUser(Principal principal, OAuth2User authentication) {
        if (principal instanceof OAuth2AuthenticationToken) {
            return usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
        } else if (principal instanceof UsernamePasswordAuthenticationToken) {
            return usersRepository.findByEmail(principal.getName());
        }
        throw new IllegalArgumentException("Unknown authentication type");
    }
}
