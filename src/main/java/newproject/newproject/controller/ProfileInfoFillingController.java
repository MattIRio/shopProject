package newproject.newproject.controller;

import newproject.newproject.authentication.OauthAndPrincipalAuthController;
import newproject.newproject.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class ProfileInfoFillingController {

    @Autowired
    OauthAndPrincipalAuthController oauthAndPrincipalAuthController;

    @GetMapping("/profileform")
    public String profileInfoForm(Principal principal, @AuthenticationPrincipal OAuth2User authentication){
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);
        if (currentUser.getUserName() != null){
            return "redirect:/mainpage";
        }
        return "profileInfoFilling";
    }

}
