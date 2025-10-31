package com.sistemaClinica.usuario.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "USUARIOS")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario")
    private String idUsuario;

    @Column(name = "nm_email", unique = true, nullable = false)
    private String nmEmail; // Usado como username para login

    @Column(name = "nm_senha", nullable = false)
    private String nmSenha; // Senha criptografada

    @Column(name = "ds_role", nullable = false)
    private String dsRole; // Ex: ROLE_ADMIN, ROLE_USER

    // Construtor padrão necessário para JPA
    public Usuario() {}

    public Usuario(String nmEmail, String nmSenha, String dsRole) {
        this.nmEmail = nmEmail;
        this.nmSenha = nmSenha;
        this.dsRole = dsRole;
    }
}
