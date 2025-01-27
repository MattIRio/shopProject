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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;


import java.util.*;

@Service
public class ProductsSorting {

    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;

//    public List<ProductModel> findProductByCategory(String searchedCategory){
//        List<ProductModel> productList = productRepository.findByCategory(searchedCategory);
//
//        if (productList.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
//        }
//        int limit = Math.min(productList.size(), 100);
//        return productList.subList(0,limit);
//    }

    public List<String> findBrandsByCategory(String searchedCategory){
        List<String> brandsList = productRepository.findBrandByCategory(searchedCategory);

        if (brandsList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        return brandsList;
    }

    public List<String> findBrandsByName(String searchedProductName){
        List<String> brandsByProductsStartsWith = productRepository.findBrandsStartingWithProductName(searchedProductName);
        List<String> brandsByproductsContains = productRepository.findBrandsContainsProductName(searchedProductName);
        brandsByproductsContains.removeAll(brandsByProductsStartsWith);
        brandsByProductsStartsWith.addAll(brandsByproductsContains);

        if (brandsByProductsStartsWith.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        return brandsByProductsStartsWith;
    }

    public  Map<String, Integer> getMaxAndMinPriceByCateory(String searchedCategory){
        Map<String, Integer> minAndMaxValue = new HashMap<>();
        minAndMaxValue.put("minValue", productRepository.findMinPriceInCategory(searchedCategory));
        minAndMaxValue.put("maxValue",productRepository.findMaxPriceInCategory(searchedCategory));

        if (minAndMaxValue.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        return minAndMaxValue;
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

    public List<ProductModel> findByProductsByPriceRandgeAndCategory(int minPrice, int maxPrice, String category, PageRequest pageRequest){
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



    public List<ProductModel> findProductByBrandsCategoryInPriceRange(String category, List<String> brand, Integer minPrice, Integer maxPrice, String productName, PageRequest pageRequest){
        Set<ProductModel> productSet = new LinkedHashSet<>();
        if (category != "" && !brand.isEmpty() && minPrice != null && maxPrice != null && !productName.equals("")){                                                //Search by name and brand in category with price range
            productSet.addAll(productRepository.findProductByBrandsCategoryInPriceRange(category, brand, productName, minPrice, maxPrice, pageRequest));
        } else if (category != null && brand.isEmpty() && minPrice == null && maxPrice == null && productName.equals("")){                                         //Search only by category
            productSet.addAll(productRepository.findByCategory(category, pageRequest));
        } else if (category != null && !brand.isEmpty() && minPrice == null && maxPrice == null && productName.equals("")){                                         //Search by brand in category
            productSet.addAll(productRepository.findByCategoryAndBrand(category, brand, pageRequest));
        } else if (category != null && brand.isEmpty() && minPrice == null && maxPrice == null && !productName.equals("")){                                         //Search by name in category
            productSet.addAll(productRepository.findByCategoryAndName(category, productName, pageRequest));
        } else if (category != null && brand.isEmpty() && minPrice != null && maxPrice != null && !productName.equals("")){                                         //Search by name and price range in category
            productSet.addAll(productRepository.findByCategoryAndNameInPriceRange(category, productName, minPrice, maxPrice, pageRequest));
        } else if (category != null && !brand.isEmpty() && minPrice != null && maxPrice != null && productName.equals("")){                                         //Search by brand and price range in category
            productSet.addAll(productRepository.findByCategoryAndBrandInPriceRange(category, brand, minPrice, maxPrice, pageRequest));
        } else if (category != null && !brand.isEmpty() && minPrice == null && maxPrice == null && !productName.equals("")){                                        //Search by name and brand in category
            productSet.addAll(productRepository.findByCategoryNameAndBrand(category, productName, brand, pageRequest));
        } else if (category != null && brand.isEmpty() && minPrice != null && maxPrice != null && productName.equals("")){                                         //Search by price range in category
            productSet.addAll(productRepository.findByCategoryInPriceRange(category, minPrice, maxPrice, pageRequest));

        } else if (productSet.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product data is missing or invalid.");
        }

        List<ProductModel> productList = new ArrayList<>(productSet);
        return productList;
    }

    public Integer countProductsByBrandsCategoryInPriceRange(String category, List<String> brand, Integer minPrice, Integer maxPrice, String productName){
        Integer productsAmount = 0;
        if (category != "" && !brand.isEmpty() && minPrice != null && maxPrice != null && !productName.equals("")){                                                //Count by name and brand in category with price range
            productsAmount = (productRepository.countProductByBrandsCategoryInPriceRange(category, brand, productName, minPrice, maxPrice));
        } else if (category != null && brand.isEmpty() && minPrice == null && maxPrice == null && productName.equals("")){                                         //Count only by category
            productsAmount = (productRepository.countByCategory(category));
        } else if (category != null && !brand.isEmpty() && minPrice == null && maxPrice == null && productName.equals("")){                                         //Count by brand in category
            productsAmount = (productRepository.countByCategoryAndBrand(category, brand));
        } else if (category != null && brand.isEmpty() && minPrice == null && maxPrice == null && !productName.equals("")){                                         //Count by name in category
            productsAmount = (productRepository.countByCategoryAndName(category, productName));
        } else if (category != null && brand.isEmpty() && minPrice != null && maxPrice != null && !productName.equals("")){                                         //Count by name and price range in category
            productsAmount = (productRepository.countByCategoryAndNameInPriceRange(category, productName, minPrice, maxPrice));
        } else if (category != null && !brand.isEmpty() && minPrice != null && maxPrice != null && productName.equals("")){                                         //Count by brand and price range in category
            productsAmount = (productRepository.countByCategoryAndBrandInPriceRange(category, brand, minPrice, maxPrice));
        } else if (category != null && !brand.isEmpty() && minPrice == null && maxPrice == null && !productName.equals("")){                                        //Count by name and brand in category
            productsAmount = (productRepository.countByCategoryNameAndBrand(category, productName, brand));
        } else if (category != null && brand.isEmpty() && minPrice != null && maxPrice != null && productName.equals("")){                                         //Count by price range in category
            productsAmount = (productRepository.countByCategoryInPriceRange(category, minPrice, maxPrice));

        } else if (productsAmount == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No products with such parametrs were found");
        }

        return productsAmount;
    }


    public Integer countProductsByName(String productName) {
        Integer productsAmount = (productRepository.countByName(productName));
        if (productsAmount == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No products with such parametrs were found");
        }

        return productsAmount;
    }




    //    public List<ProductModel> findProductByBrands(List<String> brand){
//
//        Set<ProductModel> productSet = new LinkedHashSet<>();
//
//        for (int i = 0; i < brand.size(); i++) {
//            productSet.addAll(productRepository.findByBrand(brand.get(i)));
//        }
//        if (productSet.isEmpty()) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product data is missing or invalid.");
//        }
//
//        List<ProductModel> productList = new ArrayList<>(productSet);
//        int limit = Math.min(productList.size(), 20);
//        return productList.subList(0,limit);
//    }

}
