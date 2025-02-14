package newproject.newproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String userName;

    private String password;

    private String email;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private UserType userType;

    private String profilePicture;

    public enum UserType {
        BUYER, SELLER
    }

    @ManyToMany
    @JoinTable(
            name = "user_bought_products",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductModel> boughtProducts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserOrderedProduct> orderedProducts = new ArrayList<>();

    @OneToMany
    @JoinTable(
            name = "user_published_products",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductModel> publishedProducts;

    @OneToMany
    @JoinTable(
            name = "user_preferred_products",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "id")
    )
    private List<UsersPreferencesModel> preferredProducts;

}
