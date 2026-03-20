package com.sistemaClinica.prontuario.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemaClinica.prontuario.dto.ProntuarioDTO;
import com.sistemaClinica.prontuario.service.ProntuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/prontuarios")
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    public ProntuarioController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @GetMapping
    public List<ProntuarioDTO> listarPorPaciente(@RequestParam Integer pacienteId) {
        return prontuarioService.listarPorPaciente(pacienteId);
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<ProntuarioDTO> listarPorPacientePath(@PathVariable Integer pacienteId) {
        return prontuarioService.listarPorPaciente(pacienteId);
    }

    @PostMapping
    public ResponseEntity<ProntuarioDTO> criar(@Valid @RequestBody ProntuarioDTO prontuarioDTO) {
        return ResponseEntity.ok(prontuarioService.salvar(prontuarioDTO));
    }
}
