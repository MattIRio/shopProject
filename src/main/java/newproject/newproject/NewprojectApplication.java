package newproject.newproject;

import newproject.newproject.service.fileUpload.FileUploadService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class NewprojectApplication {

	public static void main(String[] args) {
		new File(FileUploadService.uploadDirecotry).mkdir();
		SpringApplication.run(NewprojectApplication.class, args);
	}
}
