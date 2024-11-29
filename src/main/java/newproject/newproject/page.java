package newproject.newproject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "https://matthewlocalhost")
@RestController
@RequestMapping("/api")
public class page {

    @GetMapping("/mainpage")
    public String mainpage(){
        return "page";
    }
}
