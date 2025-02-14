package newproject.newproject.securityConfig;



import newproject.newproject.authentication.AuthenticationSuccessHandler;
import newproject.newproject.authentication.MyUserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;


@Configuration
@EnableWebSecurity
public class SecurityConfiguration{



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf
                        //    .disable()
                      .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())

                )

                .authorizeHttpRequests(registry -> {

                    registry.requestMatchers("/signUpUser", "/signUpPage", "/logout", "/loginPage", "/oauth-login", "/css/**", "signup.html", "/upload","/getcurrentuserdata", "/upload/profilepic", "/addcategory/{productId}","/getuserdatabyid/{id}", "/getrecomendations", "mainGallery.html", "/api/products/getproductbyid/**", "/mainpage", "/itemPage", "/**").permitAll();
                    registry.requestMatchers("/sellerPage", "/profileform").authenticated();
                    registry.requestMatchers("null").hasRole("BUYER");
                    registry.requestMatchers("/postproduct").hasRole("SELLER");
                    registry.anyRequest().permitAll();


                })
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/loginPage?logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
                .formLogin(httpSecurityFormLoginConfigurer -> {
                    httpSecurityFormLoginConfigurer
                            .loginPage("/loginPage")
                            .usernameParameter("email")
                            .successHandler(new AuthenticationSuccessHandler())
                            .defaultSuccessUrl("/profileform", true)
                            .permitAll();

                })
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(new AuthenticationSuccessHandler())
                        .loginPage("/loginPage")
                        .defaultSuccessUrl("/profileform", true)
                )
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService(MyUserDetailService myUserDetailService) {
        return myUserDetailService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider(MyUserDetailService userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
