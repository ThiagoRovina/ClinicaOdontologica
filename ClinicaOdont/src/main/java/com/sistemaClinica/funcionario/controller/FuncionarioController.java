package com.sistemaClinica.funcionario.controller;

import com.sistemaClinica.funcionario.dto.FuncionarioCadastroDTO;
import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.model.TipoFuncionario;
import com.sistemaClinica.funcionario.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<FuncionarioDTO> buscarPorId(@PathVariable String id) {
        FuncionarioDTO funcionarioDTO = funcionarioService.buscarPorId(id);
        return funcionarioDTO != null ? ResponseEntity.ok(funcionarioDTO) : ResponseEntity.notFound().build();
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarCompleto(@RequestBody FuncionarioCadastroDTO dto) {
        try {
            FuncionarioDTO funcionarioSalvo = funcionarioService.cadastrarFuncionarioEUsuario(dto);
            return ResponseEntity.ok(funcionarioSalvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
