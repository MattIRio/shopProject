package newproject.newproject.service.products;

import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.model.UsersPreferencesModel;
import newproject.newproject.repositories.PreferencesRepository;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Controller
public class ProductsRecomendationsService {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;
    @Autowired
    PreferencesRepository preferencesRepository;

    @PostMapping("/addrecomendationtouser/{productId}")
    public ResponseEntity<String> Setcategory(Principal principal, @AuthenticationPrincipal OAuth2User authentication, @PathVariable UUID productId) {
        try {
            UserModel currentUser = null;
            if (principal instanceof OAuth2AuthenticationToken) {                                                                                           //is used to memorize the categories visited by the user and the frequency of their visits.
                currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
            } else if (principal instanceof UsernamePasswordAuthenticationToken) {
                currentUser = usersRepository.findByEmail(principal.getName());
            }
            ProductModel currentProuduct = productRepository.findByUniqId(productId);
            UsersPreferencesModel currentPreference = new UsersPreferencesModel();

            String category = currentProuduct.getCategory();
            category = category.replace("[\"", "").replace("\"]", "");
            String[] parts = category.split(">>");
            if (parts.length >= 2) {
                String result = parts[0].trim() + ", " + parts[1].trim();
                UsersPreferencesModel existedPreference = preferencesRepository.findByPreferredCategoryAndUserId(result, currentUser.getId());             //cleanin the category path selecting only the 2 main one, then checking if
                if (existedPreference != null) {                                                                                                            //user already have this categories, and if so increase the value of this categories
                    existedPreference.setViewCount(existedPreference.getViewCount() + 1);
                    preferencesRepository.save(existedPreference);
                    return ResponseEntity.ok("User preference updated");
                }
                currentPreference.setPreferredCategory(result);
            }
            if (parts.length == 1){
                String result = parts[0].trim();
                currentPreference.setPreferredCategory(result);
            }

            if (preferencesRepository.findAllByUserId(currentUser.getId()).size() == 30) {
                List<UsersPreferencesModel> notRelevantPreference = preferencesRepository.findTopByUserIdOrderByViewCountAscViewDateAsc(currentUser.getId());                   //deleting the oldest category visited by user with the smallest view count
                preferencesRepository.delete(notRelevantPreference.get(0));
            }


            currentPreference.setUserId(currentUser.getId());
            currentPreference.setViewCount(currentPreference.getViewCount() + 1);                                                                          //if user has no such category yet, additing it
            currentPreference.setViewDate(LocalDateTime.now());
            preferencesRepository.save(currentPreference);
            return ResponseEntity.ok("User preference saved");
        } catch (Exception e) {
            System.err.println("An error occurred while deleting user: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }


    @GetMapping("/getrecomendations")
    public ResponseEntity<List<ProductModel>> GetCategory(Principal principal,@AuthenticationPrincipal OAuth2User authentication ) {
        try {
            UserModel currentUser = null;
            if (principal instanceof OAuth2AuthenticationToken) {                                                                                           //is used to memorize the categories visited by the user and the frequency of their visits.
                currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
            } else if (principal instanceof UsernamePasswordAuthenticationToken) {
                currentUser = usersRepository.findByEmail(principal.getName());
            }

            List<UsersPreferencesModel> mostVisitedProducts = preferencesRepository.findTopByUserIdOrderByViewCount(currentUser.getId());
            String separatedCategory1 = null;
            String separatedCategory2 = null;
            String separatedCategory3 = null;
            String separatedCategory4 = null;
            String separatedCategory5 = null;

            if (mostVisitedProducts.size() > 0) {
                String[] category1 = mostVisitedProducts.get(0).getPreferredCategory().split(",");
                System.out.println(category1.length);
                if (category1.length > 1 && category1[1] != null) {
                    separatedCategory1 = category1[1];
                } else if (category1.length == 1) {
                    separatedCategory1 = category1[0];
                }
            }
            List<ProductModel> recomendedProducts = preferencesRepository.findTopBy1stCategory(separatedCategory1);

            if (mostVisitedProducts.size() > 1) {
                String[] category2 = mostVisitedProducts.get(1).getPreferredCategory().split(",");
                if (category2.length > 1 && category2[1] != null) {
                    separatedCategory2 = category2[1];
                } else if (category2.length == 1) {
                    separatedCategory2 = category2[0];
                }
                recomendedProducts.addAll(preferencesRepository.findTopBy2ndCategory(separatedCategory2));
            }

            if (mostVisitedProducts.size() > 2) {
                String[] category3 = mostVisitedProducts.get(2).getPreferredCategory().split(",");
                if (category3.length > 1 && category3[1] != null) {
                    separatedCategory3 = category3[1];
                } else if (category3.length == 1) {
                    separatedCategory3 = category3[0];
                }
                recomendedProducts.addAll(preferencesRepository.findTopBy3rdCategory(separatedCategory3));
            }

            if (mostVisitedProducts.size() > 3) {
                String[] category4 = mostVisitedProducts.get(3).getPreferredCategory().split(",");
                if (category4.length > 1 && category4[1] != null) {
                    separatedCategory4 = category4[1];
                } else if (category4.length == 1) {
                    separatedCategory4 = category4[0];
                }
                recomendedProducts.addAll(preferencesRepository.findTopBy4thCategory(separatedCategory4));
            }

            if (mostVisitedProducts.size() > 4) {
                String[] category5 = mostVisitedProducts.get(4).getPreferredCategory().split(",");
                if (category5.length > 1 && category5[1] != null) {
                    separatedCategory5 = category5[1];
                } else if (category5.length == 1) {
                    separatedCategory5 = category5[0];
                }
                recomendedProducts.addAll(preferencesRepository.findTopBy5thCategory(separatedCategory5));
            }

            return ResponseEntity.ok(recomendedProducts);
        } catch (Exception e) {
            System.err.println("An error occurred while creating recomendations: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }


    @GetMapping("/getrecomendationsfornotloggeduser")
    public ResponseEntity<List<ProductModel>> GetCategoryForNotLoggedUser(@RequestBody List<String> preferencesList) {
        try {
            String separatedCategory1 = null;
            String separatedCategory2 = null;
            String separatedCategory3 = null;
            String separatedCategory4 = null;
            String separatedCategory5 = null;

            if (preferencesList.size() > 0) {
                String[] category1 = preferencesList.get(0).split(",");
                if (category1.length > 1 && category1[1] != null) {
                    separatedCategory1 = category1[1];
                } else if (category1.length == 1) {
                    separatedCategory1 = category1[0];
                }
            }
            if (preferencesList.size() > 1) {
                String[] category2 = preferencesList.get(1).split(",");
                if (category2.length > 1 && category2[1] != null) {
                    separatedCategory2 = category2[1];
                } else if (category2.length == 1) {
                    separatedCategory2 = category2[0];
                }
            }

            if (preferencesList.size() > 2) {
                String[] category3 = preferencesList.get(2).split(",");
                if (category3.length > 1 && category3[1] != null) {
                    separatedCategory3 = category3[1];
                } else if (category3.length == 1) {
                    separatedCategory3 = category3[0];
                }
            }

            if (preferencesList.size() > 3) {
                String[] category4 = preferencesList.get(3).split(",");
                if (category4.length > 1 && category4[1] != null) {
                    separatedCategory4 = category4[1];
                } else if (category4.length == 1) {
                    separatedCategory4 = category4[0];
                }
            }

            if (preferencesList.size() > 4) {
                String[] category5 = preferencesList.get(4).split(",");
                if (category5.length > 1 && category5[1] != null) {
                    separatedCategory5 = category5[1];
                } else if (category5.length == 1) {
                    separatedCategory5 = category5[0];
                }
            }

            List<ProductModel> recomendedProducts = preferencesRepository.findTopBy1stCategory(separatedCategory1);
            recomendedProducts.addAll(preferencesRepository.findTopBy2ndCategory(separatedCategory2));
            recomendedProducts.addAll(preferencesRepository.findTopBy3rdCategory(separatedCategory3));
            recomendedProducts.addAll(preferencesRepository.findTopBy4thCategory(separatedCategory4));
            recomendedProducts.addAll(preferencesRepository.findTopBy5thCategory(separatedCategory5));


            return ResponseEntity.ok(recomendedProducts);
        } catch (Exception e) {
            System.err.println("An error occurred while creating recomendations: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
}
