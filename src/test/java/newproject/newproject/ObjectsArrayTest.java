package newproject.newproject;

import jakarta.transaction.Transactional;
import newproject.newproject.repositories.UsersRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ObjectsArrayTest {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private ObjectsArray objectsArray;

    @Test
    void userInfoTest(){
        ResponseEntity<String> response = objectsArray.userinfo(3);

        assertEquals("Alisha", response.getBody());

    }
}