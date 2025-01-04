package newproject.newproject.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import newproject.newproject.model.ProductModel;
import newproject.newproject.service.products.ProductsService;

@Controller
@RequiredArgsConstructor
public class ProductPageController {

private final ProductsService productService;

    @GetMapping("/itempage/{productId}")
    public String itemPage(@PathVariable UUID productId, Model model) {
        ProductModel product = productService.getProductById(productId);
        model.addAttribute("product", product);
        return "itemPage";
    }
}
