package com.sistemaClinica.dentista.controller;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.service.DentistaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dentistas")
public class DentistaController {

    @Autowired
    private DentistaService dentistaService;

    @GetMapping
    public List<DentistaDTO> listarTodos() {
        return dentistaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DentistaDTO> buscarPorId(@PathVariable String id) {
        DentistaDTO dentistaDTO = dentistaService.buscarPorId(id);
        return dentistaDTO != null ? ResponseEntity.ok(dentistaDTO) : ResponseEntity.notFound().build();
    }

    @GetMapping("/por-funcionario/{idFuncionario}")
    public ResponseEntity<DentistaDTO> buscarPorFuncionario(@PathVariable String idFuncionario) {
        DentistaDTO dentistaDTO = dentistaService.buscarPorFuncionarioId(idFuncionario);
        return dentistaDTO != null ? ResponseEntity.ok(dentistaDTO) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody DentistaDTO dentistaDTO) {
        try {
            return ResponseEntity.ok(dentistaService.salvar(dentistaDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable String id, @RequestBody DentistaDTO dentistaDTO) {
        dentistaDTO.setIdDentista(id);
        try {
            return ResponseEntity.ok(dentistaService.salvar(dentistaDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        dentistaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
