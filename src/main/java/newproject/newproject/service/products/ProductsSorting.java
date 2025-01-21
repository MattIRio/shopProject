package newproject.newproject.service.products;

import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class ProductsSorting {

    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;

    public List<ProductModel> findProductByCategory(String searchedCategory){
        List<ProductModel> productList = productRepository.findByCategory(searchedCategory);

        if (productList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        int limit = Math.min(productList.size(), 100);
        return productList.subList(0,limit);
    }

    public List<String> findBrandsByCategory(String searchedCategory){
        List<String> brandsList = productRepository.findBrandByCategory(searchedCategory);

        if (brandsList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        return brandsList;
    }

    public List<UserModel> findSellersByCategory(String searchedCategory){
        List<String> sellersNames = new ArrayList<>();
        sellersNames.addAll(Arrays.asList("Bright Horizons", "Silver Oak", "Red Valley", "Blue Ridge", "Golden Field",
                "Highland Ventures", "Maple Grove", "Crystal Waters", "Sunset Ventures", "Iron Gate",
                "Morning Dew", "Silver Creek", "Mystic Woods", "Evergreen Path", "Golden Horizon",
                "White Oak", "Breeze Hill", "Lakeside Peaks", "Stone Bridge", "Blue Sky Trading",
                "Rolling Hills", "Green Meadow", "Wildflower Co.", "Bright Springs", "Mountain View",                                                 //Local database has no seller names so i'm improvising 
                "Cedar Ridge", "Maple Ridge", "Silver Bay", "Redstone Enterprises", "Golden Plains",
                "Lakeshore Partners", "Blue Rock", "Whispering Pines", "Sunrise Valley", "Clearwater Holdings",
                "Falcon Heights", "Silver Pine", "Amber Hills", "Wild Creek", "Silver Birch",
                "Stone Harbor", "Autumn Ridge", "Everwood Trading", "Sapphire Bay", "Shining Stars",
                "Sunlit Grove", "Horizon Ridge", "Redwood Path", "Clear Skies", "Lush Valley",
                "Crystal Ridge", "Sunnyfield"));

        List<Integer> sellersIdList = productRepository.findSellerIdByCategory(searchedCategory);
        List<UserModel> foundSellers = new ArrayList<>();
        for (int sellerId : sellersIdList){
            UserModel currentSeller = new UserModel();
            currentSeller.setUserName(sellersNames.get((int) (Math.random() * 40) + 1));
            currentSeller.setId(sellerId);
            foundSellers.add(currentSeller);
        }

        if (foundSellers.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        return foundSellers;
    }

    public List<ProductModel> findProductByPriceInRange(int minPrice, int maxPrice, String category, PageRequest pageRequest){
        List<ProductModel> productList = productRepository.findProductsByPriceRange(minPrice,maxPrice, category, pageRequest);

        if (productList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is no products with such price");
        }
        int limit = Math.min(productList.size(), 20);
        return productList.subList(0,limit);
    }

    public List<ProductModel> findProductBySellerId(int sellerId){
        List<ProductModel> productList = productRepository.findBySellerId(sellerId);

        if (productList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        int limit = Math.min(productList.size(), 20);
        return productList.subList(0,limit);
    }

    public List<ProductModel> findProductByBrand(String brand){
        List<ProductModel> productList = productRepository.findByBrand(brand);

        if (productList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product data is missing or invalid.");
        }
        int limit = Math.min(productList.size(), 20);
        return productList.subList(0,limit);
    }
}
