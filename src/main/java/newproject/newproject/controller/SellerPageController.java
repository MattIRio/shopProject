package newproject.newproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SellerPageController {

    @GetMapping("/sellerPage")
    public String sellerPage(){
        return("sellerPage");
    }
}
