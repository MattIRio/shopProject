package newproject.newproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class signUpController {
        @GetMapping("/signUpPage")
        public String signUpPage() {

            return "signup";
        }
    }
