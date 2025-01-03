package newproject.newproject.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "Products")
public class ProductModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "uniq_Id", unique = true)
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
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "product_category_tree")
    private String category;
    @Column(name = "sellerId")
    private Integer sellerId;

}
