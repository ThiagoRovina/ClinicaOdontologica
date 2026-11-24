package com.sistemaClinica.funcionario.controller;

import com.sistemaClinica.funcionario.dto.FuncionarioCadastroDTO;
import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.model.TipoFuncionario;
import com.sistemaClinica.funcionario.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping("/tipos")
    public TipoFuncionario[] getTiposFuncionario() {
        return TipoFuncionario.values();
    }

    @GetMapping
    public List<FuncionarioDTO> listarTodos() {
        return funcionarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(funcionarioService.buscarPorId(id));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<FuncionarioDTO> cadastrarCompleto(@Valid @RequestBody FuncionarioCadastroDTO dto) {
        return ResponseEntity.ok(funcionarioService.cadastrarFuncionarioEUsuario(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> atualizar(@PathVariable Integer id, @Valid @RequestBody FuncionarioDTO funcionarioDTO) {
        funcionarioDTO.setIdFuncionario(id);
        return ResponseEntity.ok(funcionarioService.salvar(funcionarioDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        funcionarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
