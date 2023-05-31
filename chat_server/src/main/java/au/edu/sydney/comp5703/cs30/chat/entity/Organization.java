package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.mapper.OrganizationMemberMapper;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.context.ContextLoader;

import java.util.List;

public class Organization {
    private Long id;
    private String name;
    private String fullName;
    private String description;
    private String email;

    public Organization(String name, String fullName, String description, String email) {
        this.name = name;
        this.fullName = fullName;
        this.description = description;
        this.email = email;
    }

    @JsonProperty("members")
    public List<OrganizationMember> getMembers() {
        var mapper = Repo.organizationMemberMapper;
        return mapper.findByOrgId(id);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
