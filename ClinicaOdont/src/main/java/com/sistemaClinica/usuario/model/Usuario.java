package com.sistemaClinica.usuario.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "USUARIOS")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nm_email", unique = true, nullable = false)
    @Email(message = "Email invalido")
    @NotBlank(message = "Email e obrigatorio")
    private String nmEmail;

    @Column(name = "nm_senha", nullable = false)
    @NotBlank(message = "Senha e obrigatoria")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String nmSenha;

    @Column(name = "ds_role", nullable = false)
    private String dsRole;

    public Usuario() {}

    public Usuario(String nmEmail, String nmSenha, String dsRole) {
        this.nmEmail = nmEmail;
        this.nmSenha = nmSenha;
        this.dsRole = dsRole;
    }
}
