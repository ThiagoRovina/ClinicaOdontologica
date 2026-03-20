package com.sistemaClinica.financeiro.controller;

import com.sistemaClinica.financeiro.dto.LancamentoFinanceiroDTO;
import com.sistemaClinica.financeiro.service.FinanceiroService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/financeiro/lancamentos")
public class FinanceiroController {

    private final FinanceiroService financeiroService;

    public FinanceiroController(FinanceiroService financeiroService) {
        this.financeiroService = financeiroService;
    }

    @GetMapping
    public List<LancamentoFinanceiroDTO> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return financeiroService.listar(from, to);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LancamentoFinanceiroDTO> buscarPorId(@PathVariable String id) {
        LancamentoFinanceiroDTO dto = financeiroService.buscarPorId(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody LancamentoFinanceiroDTO dto) {
        try {
            return ResponseEntity.ok(financeiroService.criar(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable String id, @RequestBody LancamentoFinanceiroDTO dto) {
        try {
            return ResponseEntity.ok(financeiroService.atualizar(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        financeiroService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
