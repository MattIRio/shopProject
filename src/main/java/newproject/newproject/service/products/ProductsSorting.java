package newproject.newproject.service.products;

import newproject.newproject.model.ProductModel;
import newproject.newproject.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductsSorting {

    @Autowired
    ProductRepository productRepository;

    public List<ProductModel> getAllProductsByPrice() {
        List<ProductModel> productList = productRepository.findAll();                 //returning first 20 products
        int mimimal = Math.min(productList.size(), 20);
        return productList.subList(0, mimimal);
    }
}
