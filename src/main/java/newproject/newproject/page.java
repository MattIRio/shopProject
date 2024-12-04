package newproject.newproject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class page {

    @GetMapping("/mainpage")
    public String mainpage(){
        return "page";
    }


    @GetMapping("/secondpage/{user_id}")
    public String secondpage(@PathVariable String user_id){
        System.out.println(user_id);
        return "page2";
    }



}
