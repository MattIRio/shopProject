package newproject.newproject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class page {

    @GetMapping("/mainpage")
    public String mainpage(){
        return "page";
    }
}
