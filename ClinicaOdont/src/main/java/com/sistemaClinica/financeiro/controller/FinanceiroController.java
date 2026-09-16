package com.sistemaClinica.financeiro.controller;

import com.sistemaClinica.financeiro.dto.LancamentoFinanceiroDTO;
import com.sistemaClinica.financeiro.service.FinanceiroService;
import com.sistemaClinica.financeiro.service.ReciboService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/financeiro/lancamentos")
public class FinanceiroController {

    private final FinanceiroService financeiroService;
    private final ReciboService reciboService;

    public FinanceiroController(FinanceiroService financeiroService, ReciboService reciboService) {
        this.financeiroService = financeiroService;
        this.reciboService = reciboService;
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

    @GetMapping("/{id}/recibo")
    public ResponseEntity<byte[]> gerarRecibo(@PathVariable String id) {
        byte[] pdf = reciboService.gerarRecibo(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=recibo-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
