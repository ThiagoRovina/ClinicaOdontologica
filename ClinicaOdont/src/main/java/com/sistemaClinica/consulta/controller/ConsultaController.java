package com.sistemaClinica.consulta.controller;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.service.ConsultaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @GetMapping
    public List<ConsultaDTO> listarTodas(
            @RequestParam(required = false) LocalDate data,
            @RequestParam(required = false) Integer dentistaId
    ) {
        if (data != null) {
            return consultaService.listarPorPeriodoEDentista(data, dentistaId);
        }
        return consultaService.listarTodas();
    }

    @GetMapping("/hoje")
    public List<ConsultaDTO> listarAgendadasParaHoje() {
        return consultaService.listarAgendadasParaHoje();
    }

    @PostMapping
    public ResponseEntity<ConsultaDTO> criar(@Valid @RequestBody ConsultaDTO consultaDTO) {
        return ResponseEntity.ok(consultaService.salvar(consultaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        consultaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ConsultaDTO> cancelarConsulta(@PathVariable Integer id) {
        return ResponseEntity.ok(consultaService.cancelar(id));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<ConsultaDTO> finalizarConsulta(@PathVariable Integer id) {
        return ResponseEntity.ok(consultaService.finalizar(id));
    }
}
