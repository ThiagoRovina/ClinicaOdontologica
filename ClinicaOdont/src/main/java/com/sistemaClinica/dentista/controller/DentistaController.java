package com.sistemaClinica.dentista.controller;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.service.DentistaService;
import jakarta.validation.Valid;
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
    public ResponseEntity<DentistaDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(dentistaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<DentistaDTO> criar(@Valid @RequestBody DentistaDTO dentistaDTO) {
        return ResponseEntity.ok(dentistaService.salvar(dentistaDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DentistaDTO> atualizar(@PathVariable Integer id, @Valid @RequestBody DentistaDTO dentistaDTO) {
        dentistaDTO.setIdDentista(id);
        return ResponseEntity.ok(dentistaService.salvar(dentistaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        dentistaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
