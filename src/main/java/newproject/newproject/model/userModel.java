package newproject.newproject.model;

import jakarta.persistence.Entity;
import org.springframework.stereotype.Service;



public class userModel {
    private String name;
    private Integer age;
    private String title;
    private boolean nigger;

    public userModel(String name, Integer age, String title, boolean nigger) {
        this.name = name;
        this.age = age;
        this.title = title;
        this.nigger = nigger;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isNigger() {
        return nigger;
    }

    public void setNigger(boolean nigger) {
        this.nigger = nigger;
    }
}
