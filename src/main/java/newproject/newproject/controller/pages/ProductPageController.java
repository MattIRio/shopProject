package newproject.newproject.controller.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;
import newproject.newproject.service.products.ProductsService;

@Controller
@RequiredArgsConstructor
public class ProductPageController {

private final ProductsService productService;

    @GetMapping("/itempage/{productId}/{productName}")
    public String itemPage() {
        return "itemPage";
    }
}
