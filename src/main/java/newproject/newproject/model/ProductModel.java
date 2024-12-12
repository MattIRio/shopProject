package newproject.newproject.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "Products")
public class ProductModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "uniq_id", unique = true)
    private UUID uniqId;

    @Column(name = "product_name")
    private String productName;
    @Column(name = "retail_price")
    private Integer  retailPrice;
    @Column(name = "discounted_price")
    private Integer  discountedPrice;
    @Column(name = "image", columnDefinition = "text")
    private String image;
    @Column(name = "description", columnDefinition = "text")
    private String description;
    @Column(name = "brand")
    private String brand;
    @Column(name = "sellerId")
    private Integer sellerId;


    public ProductModel(){}

    public ProductModel(UUID uniqId, String productName, int retailPrice, int discountedPrice, String image, String description, String brand) {
        this.uniqId = uniqId;
        this.productName = productName;
        this.retailPrice = retailPrice;
        this.discountedPrice = discountedPrice;
        this.image = image;
        this.description = description;
        this.brand = brand;
    }
}
