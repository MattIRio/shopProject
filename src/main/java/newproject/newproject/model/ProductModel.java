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
    @Column(name = "uniq_id")
    private String uniqId;

    @Column(name = "product_name")
    private String product_name;
    @Column(name = "retail_price")
    private Integer  retail_price;
    @Column(name = "discounted_price")
    private Integer  discounted_price;
    @Column(name = "image")
    private String image;
    @Column(name = "description")
    private String description;
    @Column(name = "brand")
    private String brand;


    public ProductModel(){}

    public ProductModel(String uniqId, String product_name, int retail_price, int discounted_price, String image, String description, String brand) {
        this.uniqId = uniqId;
        this.product_name = product_name;
        this.retail_price = retail_price;
        this.discounted_price = discounted_price;
        this.image = image;
        this.description = description;
        this.brand = brand;
    }
}
