package com.sistemaClinica.paciente.controller;

import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @GetMapping
    public List<PacienteDTO> listarTodos() {
        return pacienteService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDTO> buscarPorId(@PathVariable String id) {
        PacienteDTO pacienteDTO = pacienteService.buscarPorId(id);
        return pacienteDTO != null ? ResponseEntity.ok(pacienteDTO) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody PacienteDTO pacienteDTO) {
        try {
            return ResponseEntity.ok(pacienteService.salvar(pacienteDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable String id, @RequestBody PacienteDTO pacienteDTO) {
        pacienteDTO.setIdPaciente(id);
        try {
            return ResponseEntity.ok(pacienteService.salvar(pacienteDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        pacienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
