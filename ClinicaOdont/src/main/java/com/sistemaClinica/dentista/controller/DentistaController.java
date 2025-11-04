package com.sistemaClinica.dentista.controller;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.service.DentistaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dentistas")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping
    public DentistaDTO criar(@RequestBody DentistaDTO dentistaDTO) {
        return dentistaService.salvar(dentistaDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DentistaDTO> atualizar(@PathVariable String id, @RequestBody DentistaDTO dentistaDTO) {
        dentistaDTO.setIdDentista(id);
        return ResponseEntity.ok(dentistaService.salvar(dentistaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        dentistaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
