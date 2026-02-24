package com.sistemaClinica.procedimento.controller;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.service.ProcedimentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<ProcedimentoDTO> buscarPorId(@PathVariable String id) {
        ProcedimentoDTO dto = procedimentoService.buscarPorId(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ProcedimentoDTO criar(@RequestBody ProcedimentoDTO dto) {
        return procedimentoService.salvar(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcedimentoDTO> atualizar(@PathVariable String id, @RequestBody ProcedimentoDTO dto) {
        dto.setIdProcedimento(id);
        return ResponseEntity.ok(procedimentoService.salvar(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        procedimentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
