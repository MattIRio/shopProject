package newproject.newproject.controller.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SellerPageController {

    @GetMapping("/sellerPage")
    public String sellerPage(){
        return("sellerPage");
    }
}
