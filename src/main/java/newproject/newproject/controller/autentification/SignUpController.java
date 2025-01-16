package newproject.newproject.controller.autentification;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import newproject.newproject.service.signup.SignUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
public class SignUpController {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final SignUpService signUpService;

    public SignUpController(SignUpService signUpService) {
        this.signUpService = signUpService;
    }

    @GetMapping("/signUpPage")
        public String signUpPage() {                            //url to sign up page
            return "signup";
        }

    @PostMapping("/signUpUser")
    public String createUser(@RequestBody UserModel userModel, RedirectAttributes redirectAttributes) {
        try {
            signUpService.createUser(userModel, redirectAttributes);
            return "redirect:/loginPage";
        }catch (ResponseStatusException e) {
            System.out.println("Unexpected error: " + e);
            ResponseEntity.status(e.getStatusCode()).body(e.getReason()).getBody();
            return "redirect:/signUpPage";
        }
    }

    }
