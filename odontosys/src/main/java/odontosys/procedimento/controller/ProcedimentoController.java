package com.sistemaClinica.procedimento.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.service.ProcedimentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/procedimentos")
public class ProcedimentoController {

    private final ProcedimentoService procedimentoService;

    public ProcedimentoController(ProcedimentoService procedimentoService) {
        this.procedimentoService = procedimentoService;
    }

    @GetMapping
    public List<ProcedimentoDTO> listarTodos() {
        return procedimentoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProcedimentoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(procedimentoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProcedimentoDTO> criar(@Valid @RequestBody ProcedimentoDTO procedimentoDTO) {
        return ResponseEntity.ok(procedimentoService.salvar(procedimentoDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcedimentoDTO> atualizar(@PathVariable Integer id, @Valid @RequestBody ProcedimentoDTO procedimentoDTO) {
        procedimentoDTO.setIdProcedimento(id);
        return ResponseEntity.ok(procedimentoService.salvar(procedimentoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        procedimentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
