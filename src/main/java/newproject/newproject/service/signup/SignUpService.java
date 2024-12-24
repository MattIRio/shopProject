package newproject.newproject.service.signup;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
@Service
public class SignUpService {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

public void createUser(UserModel userModel, RedirectAttributes redirectAttributes) {
        if (userModel == null || userModel.getEmail() == null || userModel.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid user data provided");
        }

        UserModel existingUser = usersRepository.findByEmail(userModel.getEmail());
        if (existingUser != null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User with such email already exists");

        } else {
            UserModel localUser = new UserModel();
            localUser.setPassword(passwordEncoder.encode(userModel.getPassword()));
            localUser.setEmail(userModel.getEmail());
            usersRepository.save(localUser);
        }
    }
}
