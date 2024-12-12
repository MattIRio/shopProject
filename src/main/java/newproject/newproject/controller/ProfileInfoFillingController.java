package newproject.newproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfileInfoFillingController {

    @GetMapping("/profileform")
    public String profileInfoForm(){
        return ("/profileInfoFilling");
    }

}
