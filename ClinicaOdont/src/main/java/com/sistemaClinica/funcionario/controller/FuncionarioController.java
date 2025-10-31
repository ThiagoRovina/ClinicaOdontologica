package com.sistemaClinica.funcionario.controller;

import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "http://localhost:3000") // Adiciona a anotação CrossOrigin
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping
    public List<FuncionarioDTO> listarTodos() {
        return funcionarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> buscarPorId(@PathVariable String id) {
        FuncionarioDTO funcionarioDTO = funcionarioService.buscarPorId(id);
        return funcionarioDTO != null ? ResponseEntity.ok(funcionarioDTO) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public FuncionarioDTO criar(@RequestBody FuncionarioDTO funcionarioDTO) {
        return funcionarioService.salvar(funcionarioDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> atualizar(@PathVariable String id, @RequestBody FuncionarioDTO funcionarioDTO) {
        funcionarioDTO.setIdFuncionario(id);
        return ResponseEntity.ok(funcionarioService.salvar(funcionarioDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        funcionarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
