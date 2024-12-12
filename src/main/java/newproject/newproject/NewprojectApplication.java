package newproject.newproject;

import newproject.newproject.controller.FileUploadController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class NewprojectApplication {

	public static void main(String[] args) {
		new File(FileUploadController.uploadDirecotry).mkdir();
		SpringApplication.run(NewprojectApplication.class, args);
	}

}
