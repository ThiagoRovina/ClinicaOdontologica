package com.sistemaClinica.prontuario.controller;

import com.sistemaClinica.prontuario.dto.ProntuarioDTO;
import com.sistemaClinica.prontuario.dto.ProntuarioUpsertDTO;
import com.sistemaClinica.prontuario.service.ProntuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prontuarios")
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    public ProntuarioController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @GetMapping
    public List<ProntuarioDTO> listarTodos() {
        return prontuarioService.listarTodos();
    }

    @GetMapping("/paciente/{idPaciente}")
    public List<ProntuarioDTO> listarPorPaciente(@PathVariable String idPaciente) {
        return prontuarioService.listarPorPaciente(idPaciente);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioDTO> buscarPorId(@PathVariable String id) {
        ProntuarioDTO dto = prontuarioService.buscarPorId(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody ProntuarioUpsertDTO dto) {
        try {
            return ResponseEntity.ok(prontuarioService.criar(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable String id, @RequestBody ProntuarioUpsertDTO dto) {
        try {
            return ResponseEntity.ok(prontuarioService.atualizar(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        prontuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
