package com.sistemaClinica.consulta.controller;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "http://localhost:3000")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @GetMapping
    public List<ConsultaDTO> listarTodas() {
        return consultaService.listarTodas();
    }

    @GetMapping("/hoje")
    public List<ConsultaDTO> listarAgendadasParaHoje() {
        return consultaService.listarAgendadasParaHoje();
    }

    @PostMapping
    public ConsultaDTO criar(@RequestBody ConsultaDTO consultaDTO) {
        return consultaService.salvar(consultaDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ConsultaDTO> cancelarViaDelete(@PathVariable String id) {
        // Compatibilidade com o frontend (usa DELETE para cancelar a consulta).
        return ResponseEntity.ok(consultaService.cancelar(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ConsultaDTO> cancelarConsulta(@PathVariable String id) {
        return ResponseEntity.ok(consultaService.cancelar(id));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<ConsultaDTO> finalizarConsulta(@PathVariable String id) {
        return ResponseEntity.ok(consultaService.finalizar(id));
    }
}
