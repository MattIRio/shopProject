package newproject.newproject;

import newproject.newproject.model.userModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


@RestController
    public class ObjectsArray {

        @GetMapping("/getobjects")
        public ResponseEntity<List<userModel>> teammembers() {
            userModel user = new userModel("Van", 300, "Master", false);
            userModel user1 = new userModel("Bill", 35, "Master", false);
            userModel user2 = new userModel("Mark", 36, "Master", false);
            userModel user3 = new userModel("Bogdan", 40, "Master", true);

            List<userModel> usersArray = new ArrayList<>();

            usersArray.add(user1);
            usersArray.add(user);
            usersArray.add(user2);
            usersArray.add(user3);

            




            return ResponseEntity.ok(usersArray);
        }
    }
