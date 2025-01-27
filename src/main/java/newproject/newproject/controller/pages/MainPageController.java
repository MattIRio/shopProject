package newproject.newproject.controller.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/mainpage")
public class MainPageController {
    @GetMapping
    public String mainPage() {
        return "mainGallery";
    }

    @GetMapping("/search")
    public String searchPage() {
        return "filterItems";
    }

}
