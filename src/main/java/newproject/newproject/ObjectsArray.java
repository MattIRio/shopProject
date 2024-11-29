package newproject.newproject;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;

    @Controller
    public class ObjectsArray {


        @GetMapping("/getobjects")
        public ResponseEntity<Map<String, String>> teammembers() {
            Map<String, String> response = new HashMap<>();

            response.put("Mr Penis", "Penisc");
            response.put("Mr CockNballs", "CockNballs");
            response.put("Mr 6ar6apisko", "6ar6apisko");
            response.put("Mr Kris Peacock", "Peacock");



            return ResponseEntity.ok(response);
        }
    }
