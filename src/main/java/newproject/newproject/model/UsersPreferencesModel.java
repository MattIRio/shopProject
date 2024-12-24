package newproject.newproject.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "user_preferred_products")
public class UsersPreferencesModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String preferredCategory;

    private int viewCount;

    private int userId;

    private LocalDateTime viewDate;
}
