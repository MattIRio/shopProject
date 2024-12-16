package newproject.newproject.controller;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    @GetMapping("/loginPage")
    public String loginPage(Model model, @RequestParam(value = "error", required = false) String error, @RequestParam(value = "exception", required = false) String exception) {
            if (error != null) {
                model.addAttribute("error", "Wrong email or password");
            }
            return "login";
    }

}
